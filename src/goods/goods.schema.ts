import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CallbackWithoutResultAndOptionalError, Document } from 'mongoose';
import { randomUUID } from 'crypto';
import { updatedAtFieldPlugin } from 'src/shared';
import { User } from 'src/users/user.schema';

@Schema()
export class Goods extends Document {
  @Prop({ default: () => randomUUID() })
  _id: string;

  @Prop({ type: String, ref: User.name })
  user: string;

  @Prop({ required: true })
  title: string;

  @Prop({ type: Number })
  price: number;

  @Prop({ type: String, required: true })
  category: string;

  @Prop({ type: Number, default: 0 })
  postponed: number;

  @Prop({ type: Number })
  remainingToBePostponed: number;

  @Prop({ type: Date })
  whenWillItEnd: Date;

  @Prop({ default: () => new Date() })
  createdAt: Date;

  @Prop({ default: () => new Date() })
  updatedAt: Date;
}

export const GoodsSchema = SchemaFactory.createForClass(Goods);

GoodsSchema.plugin(updatedAtFieldPlugin);

GoodsSchema.pre('findOneAndDelete', async function (next) {
  try {
    const goodsId = this.getQuery()._id;

    await this.model.db
      .model<Notification>('Notification')
      .deleteMany({ goods: goodsId });

    next();
  } catch (error) {
    console.error('Error while cascade delete of good:', error);
    next(error);
  }
});

GoodsSchema.pre('save', function (next) {
  if (this.price != null && this.postponed != null) {
    this.remainingToBePostponed = Math.max(0, this.price - this.postponed);
  }
  this.updatedAt = new Date();
  next();
});

GoodsSchema.pre(
  'findOneAndUpdate',
  function (next: CallbackWithoutResultAndOptionalError) {
    const update = this.getUpdate() as Record<string, any>;

    const $set = update.$set ?? {};

    const price = update.price ?? $set.price;
    const postponed = update.postponed ?? $set.postponed;

    if (price !== undefined && postponed !== undefined) {
      const remaining = Math.max(0, price - postponed);

      if (!update.$set) update.$set = {};
      update.$set.remainingToBePostponed = remaining;
    }

    if (!update.$set) update.$set = {};
    update.$set.updatedAt = new Date();

    this.setUpdate(update);
    next();
  },
);
