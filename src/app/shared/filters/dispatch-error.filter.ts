import { Catch, ExceptionFilter, HttpStatus, HttpException } from '@nestjs/common';
import { MessageCodeError } from '../classes';
import { ValidationError } from 'class-validator';
import { Response } from 'express';
@Catch(MessageCodeError, ValidationError, HttpException, Error)
export class DispatchError implements ExceptionFilter {
  public catch(exception: HttpException, res: Response) {
    if (exception instanceof MessageCodeError) {
      res.setHeader('x-error-code', exception.errorCode);
      res.setHeader('x-error-message', exception.errorMessage);
      res.setHeader('x-http-status', exception.httpStatus);
      return res.status(exception.httpStatus).json({
        errorCode: exception.errorCode,
        errorMessage: exception.errorMessage,
        status: exception.httpStatus,
      });
    } else {
      return res
        .json({ errorCode: 911, errorMessage: 'INTERNAL_SERVER_ERROR', status: 500 })
        .status(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
