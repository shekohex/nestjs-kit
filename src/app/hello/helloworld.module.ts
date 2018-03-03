import { Module } from '@nestjs/common';
import { HelloWorld } from './helloworld.controller';
@Module({
  controllers: [HelloWorld],
})
export class HelloWorldModule {}
