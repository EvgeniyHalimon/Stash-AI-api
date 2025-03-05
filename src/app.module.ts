import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { CorsMiddleware } from './shared/cors.middleware';
import { DatabaseModule } from './database/database.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [DatabaseModule, NotificationsModule],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CorsMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
