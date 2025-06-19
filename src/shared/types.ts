import { IUser } from 'src/users/user.types';

export type OrderType = 'ASC' | 'DESC';

export interface IError {
  message: string;
  error: string;
  statusCode: number;
}

export interface ICustomRequest extends Request {
  user: IUser;
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export enum DateRangeType {
  MONTH = 'month',
  DAY = 'day',
}
