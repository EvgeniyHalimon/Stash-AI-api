import { Module } from '@nestjs/common';
import { PostponementHistoryController } from './postponement-history.controller';
import { PostponementHistoryService } from './postponement-history.service';

@Module({
  controllers: [PostponementHistoryController],
  providers: [PostponementHistoryService]
})
export class PostponementHistoryModule {}
