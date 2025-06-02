import { ApiProperty } from '@nestjs/swagger';

import { IGoods } from '../goods.types';
import { IUser } from 'src/users/user.types';
import { userExample } from 'src/users/user.constants';

export class GoodPresenter {
  @ApiProperty({
    example: 'd0601328-1486-434a-860e-75b843a682db',
    type: String,
    description: 'Represents id of the user',
  })
  _id: string;

  @ApiProperty({
    example: userExample,
    type: String,
    description: 'Represents user',
  })
  user: Partial<IUser>;

  @ApiProperty({
    type: Object,
    description: 'User',
    example: 'iPhone 15',
  })
  title: string;

  @ApiProperty({
    type: Number,
    description: 'Price of the goods',
    example: 999.99,
  })
  price: number;

  @ApiProperty({
    type: String,
    description: 'Category of the goods',
    required: true,
    example: 'Electronics',
  })
  category: string;

  @ApiProperty({
    type: Number,
    description: 'Number of times the goods has been postponed',
    default: 0,
    example: 0,
  })
  postponed: number;

  @ApiProperty({
    type: Number,
    description: 'Number of times the goods can still be postponed',
    default: 0,
    example: 5,
  })
  remainingToBePostponed: number;

  @ApiProperty({
    type: Date,
    description: 'Date when the goods will expire',
    example: '2025-12-31T23:59:59.999Z',
  })
  whenWillItEnd?: Date;

  @ApiProperty({
    example: '2024-08-14T08:40:32.000Z',
    type: String,
    description: 'Represents the creation date of the user',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-08-14T08:40:32.000Z',
    type: String,
    description: 'Represents the last update date of the user',
  })
  updatedAt: Date;

  constructor(good: IGoods) {
    const { _id, firstName, lastName, email, role } = good.user;
    this._id = good._id;
    this.title = good.title;
    this.price = good.price;
    this.category = good.category;
    this.user = { _id, firstName, lastName, email, role };
    this.postponed = good.postponed;
    this.remainingToBePostponed = good.remainingToBePostponed;
    this.whenWillItEnd = good.whenWillItEnd;
    this.createdAt = good.createdAt;
    this.updatedAt = good.updatedAt;
  }
}
