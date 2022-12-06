import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EntityNotFoundExceptionFilter } from './common/exceptions/entityNotFound.exceptionFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({
    type: VersioningType.URI,
  });

  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //     skipMissingProperties: true,
  //     exceptionFactory: validationExceptionFactory,
  //   }),
  // );

  app.useGlobalFilters(new EntityNotFoundExceptionFilter());

  app.enableCors({
    origin: [
      'http://localhost:8080',
      'http://localhost:8083',
      'http://localhost:3035',
    ],
  });

  const port = app.get(ConfigService).get('app.port');

  await app.listen(port);
}

bootstrap();
