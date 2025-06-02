import { Module } from '@nestjs/common';
import { GoodsController } from './goods.controller';
import { GoodsService } from './goods.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Goods, GoodsSchema } from './goods.schema';
import { DatabaseModule } from 'src/database/database.module';
import { User, UserSchema } from 'src/users/user.schema';

@Module({
  controllers: [GoodsController],
  providers: [GoodsService],
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([
      { name: Goods.name, schema: GoodsSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  exports: [GoodsService],
})
export class GoodsModule {}
