import { IUser } from 'src/users/user.types';

export interface INotifications {
  _id: string;
  user: IUser;
  text: string;
  isViewed: boolean;
  createdAt: Date;
}
