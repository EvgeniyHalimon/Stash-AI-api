import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsOptional, IsNumber, IsDate } from 'class-validator';

export class UpdateGoodsDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'Title of the goods',
    example: 'iPhone 15 Pro',
  })
  readonly title?: string;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({
    type: Number,
    description: 'Price of the goods',
    example: 1199.99,
  })
  readonly price?: number;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'Category of the goods',
    example: 'Premium Electronics',
  })
  readonly category?: string;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({
    type: Number,
    description: 'Number of times the goods has been postponed',
    example: 1,
  })
  readonly postponed?: number;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({
    type: Number,
    description: 'Number of times the goods can still be postponed',
    example: 4,
  })
  readonly remainingToBePostponed?: number;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  @ApiPropertyOptional({
    type: Date,
    description: 'Date when the goods will expire',
    example: '2025-12-31T23:59:59.999Z',
  })
  readonly whenWillItEnd?: Date;
}
