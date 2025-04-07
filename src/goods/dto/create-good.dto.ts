// libraries
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateGoodsDto {
  @IsString()
  @IsNotEmpty({ message: 'Title must not be empty' })
  @ApiProperty({
    type: String,
    description: 'Title of the goods',
    required: true,
    example: 'iPhone 15',
  })
  readonly title: string;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({
    type: Number,
    description: 'Price of the goods',
    example: 999.99,
  })
  readonly price?: number;

  @IsString()
  @IsNotEmpty({ message: 'Category must not be empty' })
  @ApiProperty({
    type: String,
    description: 'Category of the goods',
    required: true,
    example: 'Electronics',
  })
  readonly category: string;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({
    type: Number,
    description: 'Number of times the goods has been postponed',
    default: 0,
    example: 0,
  })
  readonly postponed?: number;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({
    type: Number,
    description: 'Number of times the goods can still be postponed',
    default: 0,
    example: 5,
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
