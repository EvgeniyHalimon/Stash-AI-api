import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { UserSortBy } from '../user.types';
import { SortOrder } from 'src/shared';

export class GetAllUsersDto {
  @IsEnum(SortOrder)
  @IsOptional()
  @ApiPropertyOptional({
    enum: SortOrder,
    description: 'Sort order (asc or desc)',
    default: SortOrder.ASC,
    example: SortOrder.DESC,
  })
  readonly sort?: SortOrder = SortOrder.ASC;

  @IsEnum(UserSortBy)
  @IsOptional()
  @ApiPropertyOptional({
    enum: UserSortBy,
    description: 'Field to sort by',
    default: UserSortBy.CREATED_AT,
    example: UserSortBy.CREATED_AT,
  })
  readonly sortBy?: UserSortBy.CREATED_AT;

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
