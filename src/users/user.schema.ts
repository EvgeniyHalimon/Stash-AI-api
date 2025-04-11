/* 

export const UserSchema = new Schema<IUser>({
  _id: {
    type: String,
    default: () => randomUUID(),
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


export const User = mongoose.model<IUser>('User', UserSchema); */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { randomUUID } from 'crypto';
import { UserRolesEnum } from './user.constants';

@Schema()
export class User extends Document {
  @Prop({ default: () => randomUUID() })
  _id: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: true })
  active: boolean;

  @Prop()
  password?: string;

  @Prop({
    type: String,
    enum: Object.values(UserRolesEnum),
    default: UserRolesEnum.USER,
  })
  role?: string;

  @Prop({ default: () => new Date() })
  createdAt?: Date;

  @Prop({ default: () => new Date() })
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});
