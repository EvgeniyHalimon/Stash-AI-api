import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { IGoods } from './goods.types';
import { Goods } from './goods.schema';
import { InjectModel } from '@nestjs/mongoose';
import { FindAllGoodsDto } from './dto';

@Injectable()
export class GoodsService {
  constructor(
    @InjectModel(Goods.name) private readonly goodsModel: Model<IGoods>,
  ) {}

  async create(goodsDto: Partial<IGoods>): Promise<IGoods> {
    const newGoods = new this.goodsModel(goodsDto);
    return await newGoods.save();
  }

  async findAll(
    queryParams: FindAllGoodsDto,
  ): Promise<{ items: IGoods[]; total: number; page: number; limit: number }> {
    const { sort, sortBy, page = 1, limit = 10 } = queryParams;
    const skip = (page - 1) * limit;

    const sortOptions = {};
    sortOptions[sortBy] = sort === 'asc' ? 1 : -1;

    const [items, total] = await Promise.all([
      this.goodsModel.find().sort(sortOptions).skip(skip).limit(limit).exec(),
      this.goodsModel.countDocuments().exec(),
    ]);

    return {
      items,
      total,
      page,
      limit,
    };
  }

  async findById(id: string): Promise<IGoods | null> {
    return await this.goodsModel.findById(id).exec();
  }

  async update(id: string, updateDto: Partial<IGoods>): Promise<IGoods | null> {
    return await this.goodsModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<IGoods | null> {
    return await this.goodsModel.findByIdAndDelete(id).exec();
  }
}
