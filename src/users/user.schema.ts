import mongoose, { Schema } from 'mongoose';

import { IUser } from './user.types';
import { UserRolesEnum } from './user.constants';

export const UserSchema = new Schema<IUser>({
  _id: {
    type: String,
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  active: { type: Boolean, default: true },
  password: { type: String, required: false },
  role: {
    type: String,
    enum: Object.values(UserRolesEnum),
    default: UserRolesEnum.USER,
  },
  createdAt: { type: Date, default: () => new Date() },
  updatedAt: { type: Date, default: () => new Date() },
});

UserSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export const User = mongoose.model<IUser>('User', UserSchema);
