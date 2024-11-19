import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { RolesGuard } from './guards/role.guard';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './filters';
import { TransformInterceptor } from './interceptors';
import { ValidationPipe } from './pipes';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('NestApplication');

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());
  // app.useGlobalGuards(new RolesGuard());
  app.useGlobalFilters(new HttpExceptionFilter());

  app.setGlobalPrefix('/api');

  const configService = app.get(ConfigService);

  const port = configService.get('PORT');

  await app.listen(port);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
