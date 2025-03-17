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
