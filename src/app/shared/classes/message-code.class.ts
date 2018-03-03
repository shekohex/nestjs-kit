import { errorMessages } from '../utils';
import { IErrorMessages } from '../interfaces';
import { LoggerService } from '@shared/services';

export class MessageCodeError extends Error {
  public readonly httpStatus: number;
  public readonly errorMessage: string;
  public readonly errorCode: number;
  private readonly logger: LoggerService = new LoggerService(this.name);
  constructor(messageCode: string) {
    super();
    const errorMessageConfig = this.getMessageFromMessageCode(messageCode);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.httpStatus = errorMessageConfig.httpStatus;
    this.errorMessage = errorMessageConfig.errorMessage;
    this.errorCode = errorMessageConfig.errorCode;
    this.logger.error(this.errorMessage, this);
  }

  /**
   * @description: Find the error config by the given message code.
   * @param {string} messageCode
   * @return {IErrorMessages}
   */
  private getMessageFromMessageCode(messageCode: string): IErrorMessages {
    let errorMessageConfig: IErrorMessages | undefined;
    Object.keys(errorMessages).some(key => {
      if (key === messageCode) {
        errorMessageConfig = errorMessages[key];
        return true;
      }
      return false;
    });

    if (!errorMessageConfig) throw new Error('Unable to find the given message code error.');
    return errorMessageConfig;
  }
}
