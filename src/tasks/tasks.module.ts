import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { GoodsModule } from 'src/goods/goods.module';
import { UsersModule } from 'src/users/user.module';

@Module({
  providers: [TasksService],
  imports: [GoodsModule, UsersModule],
})
export class TasksModule {}
