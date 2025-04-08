import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { INotifications } from '../notifications.types';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetAllNotificationsPresenter {
  @ApiProperty({
    type: Array<INotifications>,
    description: 'Represents array of users.',
  })
  notifications: INotifications[];

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
  readonly page: number;

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
  readonly limit: number;

  constructor(
    notifications: INotifications[],
    count: number,
    page: number,
    limit: number,
  ) {
    this.notifications = notifications;
    this.count = count;
    this.page = page;
    this.limit = limit;
  }
}
