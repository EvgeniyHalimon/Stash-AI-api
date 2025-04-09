import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { GoodsModule } from 'src/goods/goods.module';
import { UsersModule } from 'src/users/user.module';
import { EventsGateway } from 'src/events/events.gateway';

@Module({
  providers: [TasksService],
  imports: [GoodsModule, UsersModule, EventsGateway],
})
export class TasksModule {}
