import { Module } from '@nestjs/common';
import { PostponementHistoryController } from './postponement-history.controller';
import { PostponementHistoryService } from './postponement-history.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PostponementHistory,
  PostponementHistorySchema,
} from './postponement-history.schema';

@Module({
  controllers: [PostponementHistoryController],
  providers: [PostponementHistoryService],
  imports: [
    MongooseModule.forFeature([
      { name: PostponementHistory.name, schema: PostponementHistorySchema },
    ]),
  ],
  exports: [PostponementHistoryService],
})
export class PostponementHistoryModule {}
