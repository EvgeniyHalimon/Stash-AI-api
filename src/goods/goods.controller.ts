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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GoodsService } from './goods.service';
import { CreateGoodsDto, FindAllGoodsDto, UpdateGoodsDto } from './dto';
import {
  CreateProductDecorators,
  DeleteProductDecorators,
  GetAllProductsDecorators,
  GetProductByIdDecorators,
  PatchDecorators,
} from './routeDecorators';
import { CurrentUser } from 'src/shared';
import { IUser } from 'src/users/user.types';

@ApiBearerAuth('bearer')
@ApiTags('goods')
@Controller('goods')
export class GoodsController {
  constructor(private readonly goodsService: GoodsService) {}

  @Post()
  @CreateProductDecorators()
  async create(
    @Body() goodsDto: CreateGoodsDto,
    @CurrentUser() { _id }: IUser,
  ) {
    return await this.goodsService.create(goodsDto, _id);
  }

  @Get()
  @GetAllProductsDecorators()
  async findAll(@Query() query: FindAllGoodsDto) {
    return await this.goodsService.findAll(query);
  }

  @Get('by-user')
  @GetAllProductsDecorators()
  async findAllByCurrentUser(
    @Query() query: FindAllGoodsDto,
    @CurrentUser() { _id }: IUser,
  ) {
    return await this.goodsService.findAll(query, _id);
  }

  @Get(':id')
  @GetProductByIdDecorators()
  async findById(@Param('id') id: string) {
    return await this.goodsService.findById(id);
  }

  @Patch(':id')
  @PatchDecorators()
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateGoodsDto,
    @CurrentUser() { _id }: IUser,
  ) {
    return await this.goodsService.update(id, updateDto, _id);
  }

  @Delete(':id')
  @DeleteProductDecorators()
  async delete(@Param('id') id: string) {
    return await this.goodsService.delete(id);
  }
}
