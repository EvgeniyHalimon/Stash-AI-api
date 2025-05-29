import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  Patch,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GoodsService } from './goods.service';
import { CreateGoodsDto, FindAllGoodsDto, UpdateGoodsDto } from './dto';
import {
  CreateProductDecorators,
  GetProductByIdDecorators,
  GetProductDecorators,
  PatchDecorators,
} from './routeDecorators';
import { DeleteProductDecorators } from './routeDecorators/DeleteProduct.decorator';

@ApiTags('goods')
@Controller('goods')
export class GoodsController {
  constructor(private readonly goodsService: GoodsService) {}

  @Post()
  @CreateProductDecorators()
  async create(@Body() goodsDto: CreateGoodsDto) {
    return await this.goodsService.create(goodsDto);
  }

  @Get()
  @GetProductByIdDecorators()
  async findAll(@Query() query: FindAllGoodsDto) {
    return await this.goodsService.findAll(query);
  }

  @Get(':id')
  @GetProductDecorators()
  async findById(@Param('id') id: string) {
    return await this.goodsService.findById(id);
  }

  @Patch(':id')
  @PatchDecorators()
  async update(@Param('id') id: string, @Body() updateDto: UpdateGoodsDto) {
    return await this.goodsService.update(id, updateDto);
  }

  @Delete(':id')
  @DeleteProductDecorators()
  async delete(@Param('id') id: string) {
    return await this.goodsService.delete(id);
  }
}
