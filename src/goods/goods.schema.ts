import mongoose, { Schema } from 'mongoose';
import { IGoods } from './goods.types';

export const GoodsSchema = new Schema<IGoods>({
  _id: {
    type: String,
  },
  title: { type: String, required: true },
  price: { type: Number, required: false },
  category: { type: String, required: true },
  postponed: { type: Number, required: true, default: 0 },
  remainingToBePostponed: { type: Number, required: false, default: 0 },
  whenWillItEnd: {
    type: Date,
  },
  createdAt: { type: Date, default: () => new Date() },
  updatedAt: { type: Date, default: () => new Date() },
});

GoodsSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export const Goods = mongoose.model<IGoods>('Goods', GoodsSchema);
