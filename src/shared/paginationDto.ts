import { IsString, IsOptional } from 'class-validator';
import { OrderType } from './types';

export class PaginationQuery<T> {
  @IsString()
  @IsOptional()
  readonly page?: string;

  @IsString()
  @IsOptional()
  readonly limit?: string;

  @IsOptional()
  readonly order?: OrderType;

  @IsOptional()
  readonly orderBy?: keyof T;
}

export class TransformToPagination<T> {
  constructor(private readonly dto: PaginationQuery<T>) {}

  toPaginationOptions() {
    const { limit, page, orderBy, order } = this.dto;
    return {
      limit: limit ? Number(limit) : 10,
      offset: page ? (Number(page) - 1) * (limit ? Number(limit) : 10) : 0,
      order: [
        [orderBy ?? 'createdAt', order ?? 'DESC'] as [keyof T, OrderType],
      ],
    };
  }
}
