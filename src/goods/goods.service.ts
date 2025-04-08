import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { IGoods } from './goods.types';
import { Goods } from './goods.schema';
import { InjectModel } from '@nestjs/mongoose';
import { FindAllGoodsDto, GetAllGoodPresenter } from './dto';
import { vocabulary } from 'src/shared';

const {
  GOODS: { GOODS_NOT_FOUND },
} = vocabulary;

@Injectable()
export class GoodsService {
  constructor(
    @InjectModel(Goods.name) private readonly goodsModel: Model<IGoods>,
  ) {}

  async create(goodsDto: Partial<IGoods>): Promise<IGoods> {
    const newGoods = new this.goodsModel(goodsDto);
    return await newGoods.save();
  }

  async findAll(queryParams: FindAllGoodsDto): Promise<GetAllGoodPresenter> {
    const { sort, sortBy, page = 1, limit = 10 } = queryParams;
    const skip = (page - 1) * limit;

    const sortOptions = {};
    sortOptions[sortBy] = sort === 'asc' ? 1 : -1;

    const [items, total] = await Promise.all([
      this.goodsModel.find().sort(sortOptions).skip(skip).limit(limit).exec(),
      this.goodsModel.countDocuments().exec(),
    ]);

    return new GetAllGoodPresenter(items, total, page, limit);
  }

  async findByIdOrFail(id: string): Promise<IGoods | never> {
    const good = await this.goodsModel.findById(id).exec();
    if (!good) {
      throw new NotFoundException(GOODS_NOT_FOUND);
    }
    return good;
  }

  async update(id: string, updateDto: Partial<IGoods>): Promise<IGoods | null> {
    await this.findByIdOrFail(id);

    return await this.goodsModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<IGoods | null> {
    await this.findByIdOrFail(id);
    return await this.goodsModel.findByIdAndDelete(id).exec();
  }
}
