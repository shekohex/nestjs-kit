import { Module, Global } from '@nestjs/common';
import * as winston from 'winston';
import { config } from 'dotenv';

import { LoggerService, JWTService } from './services';
@Global()
@Module({
  components: [JWTService]
})
export class SharedModule {
  constructor() {
    config(); // load .env file
    LoggerService.configGlobal({
      transports: [
        new winston.transports.File({
          filename: process.env.LOG_FILE,
          json: true,
          prettyPrint: true,
          timestamp: true,
        }),
      ],
    });
  }
}
