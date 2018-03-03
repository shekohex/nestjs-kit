import { config } from 'dotenv';
import { NestFactory, NestApplication } from '@nestjs/core';
import { AppModule } from '@app/app.module';
import { LoggerService } from '@shared/services';
import { DispatchError } from '@shared/filters';
import { TransformInterceptor } from '@shared/interceptors';
import { ValidationPipe, ParseIntPipe } from '@nestjs/common';

async function bootstrap() {
  config(); // load .env file
  const app: NestApplication = await NestFactory.create(AppModule, {
    logger: new LoggerService('Main'),
  });
  await app
    .useGlobalFilters(new DispatchError())
    .useGlobalInterceptors(new TransformInterceptor())
    .useGlobalPipes(new ValidationPipe(), new ParseIntPipe())
    .disable('x-powered-by')
    .enableCors()
    .listen(parseInt(process.env.SERVER_PORT, 10) || 3000);
}
bootstrap();
