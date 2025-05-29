// libraries
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

import { AppModule } from './app.module';

import { config } from './config';

import { AllExceptionsFilter, CustomValidationPipe } from './shared';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableCors({
    origin: config.FE_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  app.useGlobalPipes(
    new CustomValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // For detailed information, you need to go to https://helmetjs.github.io/
  app.use(helmet());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('STASH-AI API')
    .setDescription('The STASH-AI API v1')
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
