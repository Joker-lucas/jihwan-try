import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomError } from '../../common/error/error';
import {
  ERROR_CODES,
  ERROR_INFO,
  ErrorCode,
} from '../../common/error/error-definition';

@Catch()
export class ErrorFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode: number;
    let errorCode: ErrorCode;
    let message: string;

    if (exception instanceof CustomError && ERROR_INFO[exception.errorCode]) {
      const errorDetail = ERROR_INFO[exception.errorCode];
      statusCode = errorDetail.statusCode;
      errorCode = exception.errorCode;
      message = errorDetail.message;
    } 
    else {
      const defaultError = ERROR_INFO[ERROR_CODES.INTERNAL_SERVER_ERROR];
      
      statusCode = defaultError.statusCode;
      errorCode = ERROR_CODES.INTERNAL_SERVER_ERROR;
      message = defaultError.message; 
    }

    console.error(
      `[${errorCode}] ${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : exception,
    );

    response.status(statusCode).json({
      error: {
        code: errorCode,
        message: message,
      },
    });
  }
}