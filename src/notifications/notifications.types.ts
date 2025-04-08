import { IUser } from 'src/users/user.types';

export interface INotifications {
  _id: string;
  user: IUser;
  text: string;
  isViewed: boolean;
  createdAt: Date;
}

export enum NotificationsSortBy {
  CREATED_AT = 'createdAt',
  TEXT = 'text',
  IS_VIEWED = 'isViewed',
}
