import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { GoodsService } from './goods.service';
import { CreateGoodsDto, FindAllGoodsDto, UpdateGoodsDto } from './dto';
import { vocabulary } from 'src/shared';

const {
  GOODS: { GOODS_NOT_FOUND },
} = vocabulary;

@ApiTags('goods')
@Controller('goods')
export class GoodsController {
  constructor(private readonly goodsService: GoodsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new goods item' })
  @ApiResponse({
    status: 201,
    description: 'The goods has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() goodsDto: CreateGoodsDto) {
    return await this.goodsService.create(goodsDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all goods with filtering and pagination' })
  @ApiResponse({ status: 200, description: 'Return all goods.' })
  async findAll(@Query() query: FindAllGoodsDto) {
    return await this.goodsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a goods item by id' })
  @ApiResponse({ status: 200, description: 'Return the goods item.' })
  @ApiNotFoundResponse({
    example: {
      message: GOODS_NOT_FOUND,
      error: 'Not Found',
      statusCode: HttpStatus.NOT_FOUND,
    },
    description: "When goods doesn't exist on database",
  })
  async findById(@Param('id') id: string) {
    return await this.goodsService.findByIdOrFail(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a goods item' })
  @ApiResponse({
    status: 200,
    description: 'The goods has been successfully updated.',
  })
  @ApiNotFoundResponse({
    example: {
      message: GOODS_NOT_FOUND,
      error: 'Not Found',
      statusCode: HttpStatus.NOT_FOUND,
    },
    description: "When goods doesn't exist on database",
  })
  async update(@Param('id') id: string, @Body() updateDto: UpdateGoodsDto) {
    return await this.goodsService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a goods item' })
  @ApiResponse({
    status: 200,
    description: 'The goods has been successfully deleted.',
  })
  @ApiNotFoundResponse({
    example: {
      message: GOODS_NOT_FOUND,
      error: 'Not Found',
      statusCode: HttpStatus.NOT_FOUND,
    },
    description: "When goods doesn't exist on database",
  })
  async delete(@Param('id') id: string) {
    return await this.goodsService.delete(id);
  }
}
