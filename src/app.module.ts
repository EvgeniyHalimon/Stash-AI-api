import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { CorsMiddleware } from './shared/cors.middleware';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DatabaseModule],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CorsMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
