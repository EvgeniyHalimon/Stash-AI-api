import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { IGoods } from './goods.types';
import { Goods } from './goods.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class GoodsService {
  constructor(
    @InjectModel(Goods.name) private readonly goodsModel: Model<IGoods>,
  ) {}

  async create(goodsDto: Partial<IGoods>): Promise<IGoods> {
    const newGoods = new this.goodsModel(goodsDto);
    return await newGoods.save();
  }

  async findAll(): Promise<IGoods[]> {
    return await this.goodsModel.find().exec();
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
