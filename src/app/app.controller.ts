import { Controller, Get } from '@nestjs/common';

@Controller()
export class HelloWorld {
  @Get()
  async hello() {
    return { message: 'Hello World !' };
  }
}
