import mongoose, { Schema } from 'mongoose';
import { INotifications } from './notifications.types';

const NotificationsSchema = new Schema<INotifications>({
  _id: {
    type: String,
  },
  user: { type: String, ref: 'User' },
  text: { type: String, required: true },
  isViewed: { type: Boolean, default: false },
  createdAt: { type: Date, default: () => new Date() },
});

export const Notification = mongoose.model<INotifications>(
  'Notification',
  NotificationsSchema,
);
