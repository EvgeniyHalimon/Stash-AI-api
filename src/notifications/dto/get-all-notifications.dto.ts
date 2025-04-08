import { SortOrder } from 'src/shared';
import { NotificationsSortBy } from '../notifications.types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min, Max, IsEnum } from 'class-validator';

export class GetAllNotificationDto {
  @IsEnum(SortOrder)
  @IsOptional()
  @ApiPropertyOptional({
    enum: SortOrder,
    description: 'Sort order (asc or desc)',
    default: SortOrder.ASC,
    example: SortOrder.DESC,
  })
  readonly sort?: SortOrder = SortOrder.ASC;

  @IsEnum(NotificationsSortBy)
  @IsOptional()
  @ApiPropertyOptional({
    enum: NotificationsSortBy,
    description: 'Field to sort by',
    default: NotificationsSortBy.CREATED_AT,
    example: NotificationsSortBy.CREATED_AT,
  })
  readonly sortBy?: NotificationsSortBy = NotificationsSortBy.CREATED_AT;

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
