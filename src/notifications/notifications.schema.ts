import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { randomUUID } from 'crypto';

@Schema()
export class Notification extends Document {
  @Prop({ default: () => randomUUID() })
  _id: string;

  @Prop({ type: String, ref: 'User' })
  user: string;

  @Prop()
  text: string;

  @Prop({ default: false })
  isViewed: boolean;

  @Prop({ default: () => new Date() })
  createdAt: Date;
}

export const NotificationsSchema = SchemaFactory.createForClass(Notification);
