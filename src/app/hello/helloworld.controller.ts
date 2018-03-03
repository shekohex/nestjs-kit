import { Controller, Get } from '@nestjs/common';
import { LoggerService } from '@shared/services';
import { MessageCodeError } from '@app/shared/classes';

@Controller()
export class HelloWorld {
  private logger: LoggerService = new LoggerService(HelloWorld.name);
  @Get()
  async hello() {
    this.logger.log('Test LOG');
    this.logger.warn('Test WARN');
    this.logger.error('Test Error');
    return { message: 'Hello World !!' };
  }
  @Get('error')
  async error() {
    throw new MessageCodeError('APP.SERVER_ERROR');
  }
}
