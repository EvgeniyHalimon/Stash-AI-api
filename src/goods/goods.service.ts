import {
  Injectable,
  Logger,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryOptions, SortOrder } from 'mongoose';
import * as dayjs from 'dayjs';

import { IGoods } from './goods.types';
import { Goods } from './goods.schema';
import { CreateGoodsDto, FindAllGoodsDto, GetAllGoodPresenter } from './dto';

import { vocabulary } from 'src/shared';
import { PostponementHistoryService } from 'src/postponement-history/postponement-history.service';

const {
  GOODS: { GOODS_NOT_FOUND },
} = vocabulary;

@Injectable()
export class GoodsService {
  private readonly logger = new Logger(GoodsService.name);

  constructor(
    @InjectModel(Goods.name)
    private readonly goodsModel: Model<IGoods>,
    private readonly history: PostponementHistoryService,
  ) {}

  async create(goodsDto: Partial<IGoods>, _id: string): Promise<IGoods> {
    try {
      const newGoods = new this.goodsModel({ user: _id, ...goodsDto });
      return await newGoods.save();
    } catch (error) {
      this.logger.error('Error creating goods', error.stack || error.message);
      throw new InternalServerErrorException('Failed to create goods');
    }
  }

  async findAll(
    queryParams: FindAllGoodsDto,
    user?: string,
  ): Promise<GetAllGoodPresenter> {
    try {
      const {
        sort = 'desc',
        sortBy = 'createdAt',
        page,
        limit,
        date,
        range = 'month',
      } = queryParams;

      const sortOptions: Record<string, SortOrder> = {
        [sortBy]: sort === 'asc' ? 1 : -1,
      };

      const filter: Record<string, any> = user ? { user } : {};

      if (date) {
        const targetDate = new Date(`${date}T00:00:00.000Z`);

        let from: Date;
        let to: Date;

        if (range === 'day') {
          from = new Date(targetDate);
          to = new Date(targetDate);
          to.setUTCHours(23, 59, 59, 999);
        } else {
          const year = targetDate.getUTCFullYear();
          const month = targetDate.getUTCMonth();
          from = new Date(Date.UTC(year, month, 1));
          to = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));
        }

        filter.whenWillItEnd = {
          $gte: from,
          $lte: to,
        };
      }

      const query = this.goodsModel
        .find(filter)
        .populate({
          path: 'user',
          select: '_id firstName lastName email role',
        })
        .sort(sortOptions);

      if (page && limit) {
        const skip = (page - 1) * limit;
        query.skip(skip).limit(limit);
      }

      const [items, total] = await Promise.all([
        query.exec(),
        this.goodsModel.countDocuments(filter).exec(),
      ]);

      return new GetAllGoodPresenter(items, total, page ?? 1, limit ?? total);
    } catch (error) {
      this.logger.error('Error retrieving goods', error.stack || error.message);
      throw new InternalServerErrorException('Failed to retrieve goods');
    }
  }

  async findById(id: string): Promise<IGoods> {
    try {
      await this.findOneOrFail({ _id: id });
      return await this.goodsModel
        .findById(id)
        .populate({
          path: 'user',
          select: '_id firstName lastName email role',
        })
        .exec();
    } catch (error) {
      this.logger.error(
        `Error finding good by ID: ${id}`,
        error.stack || error.message,
      );
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException('Failed to find good by ID');
    }
  }

  async update(
    _id: string,
    updateDto: Partial<IGoods>,
    user: string,
  ): Promise<IGoods | null> {
    const { postponed } = updateDto;
    try {
      const good = await this.findOneOrFail({ _id });
      const difference = postponed - good.postponed;

      if (postponed && difference !== 0) {
        await this.history.create({
          user,
          goods: good._id,
          amount: difference,
        });
      }

      return await this.goodsModel
        .findByIdAndUpdate(_id, updateDto, { new: true })
        .exec();
    } catch (error) {
      this.logger.error(
        `Error updating good ID: ${_id}`,
        error.stack || error.message,
      );
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException('Failed to update good');
    }
  }

  async delete(id: string): Promise<IGoods | null> {
    try {
      await this.findOneOrFail({ _id: id });
      await this.history.deleteManyGoods(id);
      return await this.goodsModel.findByIdAndDelete(id).exec();
    } catch (error) {
      this.logger.error(
        `Error deleting good ID: ${id}`,
        error.stack || error.message,
      );
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException('Failed to delete good');
    }
  }

  async findOneOrFail(
    params: QueryOptions<Partial<CreateGoodsDto>>,
  ): Promise<IGoods> {
    const good = await this.goodsModel.findOne(params).exec();
    if (!good) {
      throw new NotFoundException(GOODS_NOT_FOUND);
    }
    return good;
  }

  async findEndingSoonForEachUser(minutesBeforeEnd = 60): Promise<any[]> {
    try {
      const now = new Date();
      const soon = dayjs(now).add(minutesBeforeEnd, 'minute').toDate();

      const groupedGoods = await this.goodsModel.aggregate([
        {
          $match: {
            whenWillItEnd: { $lte: soon },
          },
        },
        {
          $group: {
            _id: '$user',
            goods: { $push: '$$ROOT' },
            totalGoods: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'userInfo',
          },
        },
        {
          $unwind: {
            path: '$userInfo',
            preserveNullAndEmptyArrays: true,
          },
        },
      ]);

      return groupedGoods;
    } catch (error) {
      this.logger.error(
        'Error finding goods ending soon for each user',
        error.stack || error.message,
      );
      throw new InternalServerErrorException('Failed to get ending soon goods');
    }
  }
}
