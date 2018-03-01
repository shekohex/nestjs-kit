import { Module } from '@nestjs/common';
import { HelloWorld } from './app.controller';
@Module({
  controllers: [HelloWorld],
})
export class AppModule {}
