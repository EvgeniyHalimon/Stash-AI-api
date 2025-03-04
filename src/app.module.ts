import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { CorsMiddleware } from './shared/cors.middleware';

@Module({
  imports: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CorsMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
