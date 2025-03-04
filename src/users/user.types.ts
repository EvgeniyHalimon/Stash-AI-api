// constants
import { UserRolesEnum } from './user.constants';

export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: UserRole;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = UserRolesEnum.USER | UserRolesEnum.ADMIN;
