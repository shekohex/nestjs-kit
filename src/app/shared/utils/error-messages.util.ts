import { HttpStatus } from '@nestjs/common';
import { IErrorMessages } from '../interfaces';
import { ErrorCode } from '../enums';

export const errorMessages: { [messageCode: string]: IErrorMessages } = {
  'AUTH.BAD_TOKEN': {
    errorCode: ErrorCode.BAD_TOKEN,
    errorMessage: 'The Token you provided seems to be invalid or expired, please login again.',
    httpStatus: HttpStatus.UNAUTHORIZED,
    type: 'BAD_TOKEN',
  },
  'AUTH.TOKEN_ERROR': {
    errorCode: ErrorCode.TOKEN_ERROR,
    errorMessage: 'There is an error while creating your token, please try again.',
    httpStatus: HttpStatus.EXPECTATION_FAILED,
    type: 'TOKEN_ERROR',
  },
  'APP.SERVER_ERROR': {
    errorCode: ErrorCode.SERVER_ERROR,
    errorMessage: 'There is an error with our servers, please try again later.',
    httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
    type: 'SERVER_ERROR',
  },
};
