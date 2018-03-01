import { config } from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@app/app.module';
async function bootstrap() {
  config(); // load .env file
  const app = await NestFactory.create(AppModule);
  await app.listen(parseInt(process.env.SERVER_PORT, 10) || 3000);
}
bootstrap();
