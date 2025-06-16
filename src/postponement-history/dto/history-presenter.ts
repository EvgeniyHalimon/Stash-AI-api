import { ApiProperty } from '@nestjs/swagger';
import { IPostponementHistory } from '../postponement-history.types';

export class HistoryPresenter {
  @ApiProperty({
    example: 'd0601328-1486-434a-860e-75b843a682db',
    type: String,
    description: 'Represents id of the user',
  })
  _id: string;

  @ApiProperty({
    type: String,
    description: 'Represents user',
    example: 'd0601328-1486-434a-860e-75b843a682db',
  })
  user: string;

  @ApiProperty({
    type: Object,
    description: 'Represents good',
    example: 'd0601328-1486-434a-860e-75b843a682db',
  })
  goods: string;

  @ApiProperty({
    type: Number,
    description: 'Amount of money that has been postponed',
    example: 0,
  })
  amount: number;

  @ApiProperty({
    example: '2024-08-14T08:40:32.000Z',
    type: String,
    description: 'Represents the date of the update of postponement',
  })
  createdAt: Date;

  constructor(good: IPostponementHistory) {
    this._id = good._id;
    this.user = good.user;
    this.goods = good.goods;
    this.amount = good.amount;
    this.createdAt = good.createdAt;
  }
}
