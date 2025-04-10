import mongoose, { Schema } from 'mongoose';
import { randomUUID } from 'crypto';
import { INotifications } from './notifications.types';

export const NotificationsSchema = new Schema<INotifications>({
  _id: {
    type: String,
    default: () => randomUUID(),
  },
  user: { type: String, ref: 'User' },
  text: { type: String },
  isViewed: { type: Boolean, default: false },
  createdAt: { type: Date, default: () => new Date() },
});

export const Notification = mongoose.model<INotifications>(
  'Notification',
  NotificationsSchema,
);
