import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { CorsMiddleware } from './shared/cors.middleware';
import { DatabaseModule } from './database/database.module';
import { NotificationsModule } from './notifications/notifications.module';
import { TasksModule } from './tasks/tasks.module';
import { ScheduleModule } from '@nestjs/schedule';
import { GoodsModule } from './goods/goods.module';
import { EventsModule } from './events/events.module';
import { AuthModule } from './auth/auth.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { NormalizeUrlMiddleware } from './shared';
import { PostponementHistoryModule } from './postponement-history/postponement-history.module';

@Module({
  imports: [
    DatabaseModule,
    NotificationsModule,
    TasksModule,
    ScheduleModule.forRoot(),
    TasksModule,
    GoodsModule,
    EventsModule,
    AuthModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    PostponementHistoryModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CorsMiddleware, NormalizeUrlMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
