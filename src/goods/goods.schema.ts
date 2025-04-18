import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { randomUUID } from 'crypto';

@Schema()
export class Goods extends Document {
  @Prop({ default: () => randomUUID() })
  _id: string;

  @Prop({ type: String, ref: 'User' })
  user: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  price: number;

  @Prop({ required: true })
  category: string;

  @Prop({ default: 0 })
  postponed: number;

  @Prop()
  remainingToBePostponed: number;

  @Prop()
  whenWillItEnd: Date;

  @Prop({ default: () => new Date() })
  createdAt: Date;

  @Prop({ default: () => new Date() })
  updatedAt: Date;
}

export const GoodsSchema = SchemaFactory.createForClass(Goods);

GoodsSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});
