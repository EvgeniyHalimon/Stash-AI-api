import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { SortOrder, GoodsSortBy } from '../goods.types';

export class FindAllGoodsDto {
  @IsEnum(SortOrder)
  @IsOptional()
  @ApiPropertyOptional({
    enum: SortOrder,
    description: 'Sort order (asc or desc)',
    default: SortOrder.ASC,
    example: SortOrder.DESC,
  })
  readonly sort?: SortOrder = SortOrder.ASC;

  @IsEnum(GoodsSortBy)
  @IsOptional()
  @ApiPropertyOptional({
    enum: GoodsSortBy,
    description: 'Field to sort by',
    default: GoodsSortBy.CREATED_AT,
    example: GoodsSortBy.PRICE,
  })
  readonly sortBy?: GoodsSortBy = GoodsSortBy.CREATED_AT;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  @ApiPropertyOptional({
    type: Number,
    description: 'Page number for pagination',
    default: 1,
    example: 1,
  })
  readonly page?: number = 1;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  @ApiPropertyOptional({
    type: Number,
    description: 'Number of items per page',
    default: 10,
    example: 10,
  })
  readonly limit?: number = 10;
}
