import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { CorsMiddleware } from './shared/cors.middleware';
import { DatabaseModule } from './database/database.module';
import { NotificationsModule } from './notifications/notifications.module';
import { TasksModule } from './tasks/tasks.module';
import { ScheduleModule } from '@nestjs/schedule';
import { GoodsModule } from './goods/goods.module';

@Module({
  imports: [
    DatabaseModule,
    NotificationsModule,
    TasksModule,
    ScheduleModule.forRoot(),
    TasksModule,
    GoodsModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CorsMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
