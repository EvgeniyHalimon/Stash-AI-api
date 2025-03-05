import { IUser } from 'src/users/user.types';

export interface INotifications {
  _id: string;
  user: IUser;
  text: string;
  createdAt: Date;
}
