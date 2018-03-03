import * as winston from 'winston';
import * as chalk from 'chalk';
import * as PrettyError from 'pretty-error';
import { LoggerInstance, LoggerOptions, Transport } from 'winston';
import { config } from 'dotenv';
config(); // load .env file
export class LoggerService {
  private readonly logger: LoggerInstance;
  private readonly prettyError = new PrettyError();
  public static loggerOptions: LoggerOptions = {
    transports: [
      new winston.transports.File({
        filename: process.env.LOG_FILE,
        json: true,
        prettyPrint: true,
        timestamp: true,
      }),
    ],
  };
  constructor(private context: string, transport?) {
    this.logger = (winston as any).createLogger(LoggerService.loggerOptions);
    this.prettyError.skipNodeFiles();
    this.prettyError.skipPackage('express', '@nestjs/common', '@nestjs/core');
  }
  get Logger(): LoggerInstance {
    return this.logger;
  }
  static configGlobal(options?: LoggerOptions) {
    this.loggerOptions = options;
  }
  log(message: string): void {
    const currentDate = new Date();
    this.logger.info(message, {
      timestamp: currentDate.toISOString(),
      context: this.context,
    });
    this.formatedLog('info', message);
  }
  error(message: string, trace?: any): void {
    const currentDate = new Date();
    this.logger.error(`${message} -> (${trace || 'trace not provided !'})`, {
      timestamp: currentDate.toISOString(),
      context: this.context,
    });
    this.formatedLog('error', message, trace);
  }
  warn(message: string): void {
    const currentDate = new Date();
    this.logger.warn(message, {
      timestamp: currentDate.toISOString(),
      context: this.context,
    });
    this.formatedLog('warn', message);
  }
  overrideOptions(options: LoggerOptions) {
    this.logger.configure(options);
  }
  private formatedLog(level: string, message: string, error?): void {
    let result = '';
    const color = chalk.default;
    const currentDate = new Date();
    const time = `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;

    switch (level) {
      case 'info':
        result = `[${color.blue('INFO')}] ${color.dim.yellow.bold.underline(time)} [${color.green(
          this.context,
        )}] ${message}`;
        break;
      case 'error':
        result = `[${color.red('ERR')}] ${color.dim.yellow.bold.underline(time)} [${color.green(
          this.context,
        )}] ${message}`;
        if (error) this.prettyError.render(error, true);
        break;
      case 'warn':
        result = `[${color.yellow('WARN')}] ${color.dim.yellow.bold.underline(time)} [${color.green(
          this.context,
        )}] ${message}`;
        break;
      default:
        break;
    }
    console.log(result);
  }
}
