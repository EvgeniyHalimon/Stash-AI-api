export interface IGoods {
  _id: string;
  title: string;
  price: number;
  category: string;
  postponed: number;
  remainingToBePostponed: number;
  whenWillItEnd: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum GoodsSortBy {
  TITLE = 'title',
  PRICE = 'price',
  CATEGORY = 'category',
  POSTPONED = 'postponed',
  REMAINING_TO_BE_POSTPONED = 'remainingToBePostponed',
  WHEN_WILL_IT_END = 'whenWillItEnd',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}
