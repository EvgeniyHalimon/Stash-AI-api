import { Module } from '@nestjs/common';
import { GoodsController } from './goods.controller';
import { GoodsService } from './goods.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Goods, GoodsSchema } from './goods.schema';
import { DatabaseModule } from 'src/database/database.module';
import { PostponementHistoryModule } from 'src/postponement-history/postponement-history.module';

@Module({
  controllers: [GoodsController],
  providers: [GoodsService],
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([{ name: Goods.name, schema: GoodsSchema }]),
    PostponementHistoryModule,
  ],
  exports: [GoodsService],
})
export class GoodsModule {}
