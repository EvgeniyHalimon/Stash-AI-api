import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { randomUUID } from 'crypto';
import { UserRolesEnum } from './user.constants';
import { Goods } from 'src/goods/goods.schema';
import { updatedAtFieldPlugin } from 'src/shared';

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

UserSchema.plugin(updatedAtFieldPlugin);

UserSchema.pre('findOneAndDelete', async function (next) {
  try {
    const userId = this.getQuery()._id;

    await this.model.db.model<Goods>('Goods').deleteMany({ user: userId });

    await this.model.db
      .model<Notification>('Notification')
      .deleteMany({ user: userId });

    next();
  } catch (error) {
    console.error('Error while cascade delete of user:', error);
    next(error);
  }
});
