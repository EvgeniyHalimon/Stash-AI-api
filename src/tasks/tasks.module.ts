import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { GoodsModule } from 'src/goods/goods.module';
import { UsersModule } from 'src/users/user.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { EventsModule } from 'src/events/events.module';

@Module({
  providers: [TasksService],
  imports: [GoodsModule, UsersModule, EventsModule, NotificationsModule],
})
export class TasksModule {}
