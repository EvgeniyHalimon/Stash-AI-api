// libraries
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

import { config } from './config';

import { CustomValidationPipe } from './shared/CustomValidationPipe';

// exception filter
//import { HttpExceptionFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.enableCors();
  //remove before deploy
  //app.useLogger(app.get(Logger));
  //app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new CustomValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Bred API')
    .setDescription('The Bred API v1')
    .setVersion('1.0')
    .addSecurity('bearer', {
      type: 'http',
    })
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api', app, document, {
    jsonDocumentUrl: 'swagger/json',
    explorer: true,
  });

  await app.listen(config.SERVER_PORT);
}
bootstrap();
