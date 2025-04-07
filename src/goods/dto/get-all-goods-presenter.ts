import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min, Max } from 'class-validator';
import { GoodPresenter } from './good-presenter';
import { IGoods } from '../goods.types';

export class GetAllGoodPresenter {
  @ApiProperty({
    type: [GoodPresenter],
    description: 'Represents array of users.',
  })
  users: GoodPresenter[];

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Represents count of users',
  })
  count: number;

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

  constructor(goods: IGoods[], count: number, page: number, limit: number) {
    this.users = goods.map((user) => new GoodPresenter(user));
    this.count = count;
    this.page = page;
    this.limit = limit;
  }
}
