import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserPresenter } from './user-presenter';
import { IUser } from '../user.types';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min, Max } from 'class-validator';

export class GetAllUserPresenter {
  @ApiProperty({
    type: [UserPresenter],
    description: 'Represents array of users.',
  })
  users: UserPresenter[];

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

  constructor(users: IUser[], count: number, page: number, limit: number) {
    this.users = users.map((user) => new UserPresenter(user));
    this.count = count;
    this.page = page;
    this.limit = limit;
  }
}
