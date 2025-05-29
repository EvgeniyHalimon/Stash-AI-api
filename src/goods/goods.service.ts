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

const {
  GOODS: { GOODS_NOT_FOUND },
} = vocabulary;

@Injectable()
export class GoodsService {
  private readonly logger = new Logger(GoodsService.name);

  constructor(
    @InjectModel(Goods.name)
    private readonly goodsModel: Model<IGoods>,
  ) {}

  async create(goodsDto: Partial<IGoods>): Promise<IGoods> {
    try {
      const newGoods = new this.goodsModel(goodsDto);
      return await newGoods.save();
    } catch (error) {
      this.logger.error('Error creating goods', error.stack || error.message);
      throw new InternalServerErrorException('Failed to create goods');
    }
  }

  async findAll(queryParams: FindAllGoodsDto): Promise<GetAllGoodPresenter> {
    try {
      const { sort, sortBy, page = 1, limit = 10 } = queryParams;
      const skip = (page - 1) * limit;

      const sortOptions: Record<string, SortOrder> = {
        [sortBy]: sort === 'asc' ? 1 : -1,
      };

      const [items, total] = await Promise.all([
        this.goodsModel.find().sort(sortOptions).skip(skip).limit(limit).exec(),
        this.goodsModel.countDocuments().exec(),
      ]);

      return new GetAllGoodPresenter(items, total, page, limit);
    } catch (error) {
      this.logger.error('Error retrieving goods', error.stack || error.message);
      throw new InternalServerErrorException('Failed to retrieve goods');
    }
  }

  async findById(id: string): Promise<IGoods> {
    try {
      await this.findOneOrFail({ _id: id });
      return await this.goodsModel.findById(id).exec();
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

  async update(id: string, updateDto: Partial<IGoods>): Promise<IGoods | null> {
    try {
      await this.findOneOrFail({ _id: id });

      return await this.goodsModel
        .findByIdAndUpdate(id, updateDto, { new: true })
        .exec();
    } catch (error) {
      this.logger.error(
        `Error updating good ID: ${id}`,
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
