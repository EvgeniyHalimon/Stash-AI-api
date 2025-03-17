import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { GoodsService } from './goods.service';
import { IGoods } from './goods.types';

@Controller('goods')
export class GoodsController {
  constructor(private readonly goodsService: GoodsService) {}

  @Post()
  async create(@Body() goodsDto: Partial<IGoods>) {
    return await this.goodsService.create(goodsDto);
  }

  @Get()
  async findAll() {
    return await this.goodsService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.goodsService.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: Partial<IGoods>) {
    return await this.goodsService.update(id, updateDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.goodsService.delete(id);
  }
}
