import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsDateString } from 'class-validator';

enum DateRangeType {
  MONTH = 'month',
  DAY = 'day',
}

export class FindAllHistoryDto {
  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    type: String,
    description: 'Filter history by date',
    example: '2025-06-09',
  })
  readonly date?: string;

  @IsOptional()
  @IsEnum(DateRangeType)
  @ApiPropertyOptional({
    enum: DateRangeType,
    description: 'Whether to filter by day or month',
    default: DateRangeType.MONTH,
    example: DateRangeType.DAY,
  })
  readonly range?: DateRangeType;
}
