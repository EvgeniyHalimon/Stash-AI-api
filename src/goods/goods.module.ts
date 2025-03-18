import { Module } from '@nestjs/common';
import { GoodsController } from './goods.controller';
import { GoodsService } from './goods.service';
import { goodsProviders } from './goods.providers';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [GoodsController],
  providers: [GoodsService, ...goodsProviders],
  imports: [DatabaseModule],
})
export class GoodsModule {}
