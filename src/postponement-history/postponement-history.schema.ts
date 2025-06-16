import { Prop, Schema } from '@nestjs/mongoose';
import { Goods } from 'src/goods/goods.schema';
import { User } from 'src/users/user.schema';

@Schema()
export class PostponementHistory extends Document {
  @Prop({ type: String, ref: Goods.name, required: true })
  goods: string;

  @Prop({ type: String, ref: User.name, required: true })
  user: string;

  @Prop({ type: Number, required: true })
  amount: number;

  @Prop({ default: () => new Date(), type: Date })
  createdAt: Date;
}
