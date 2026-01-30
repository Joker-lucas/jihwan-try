import { ERROR_CODES, ERROR_INFO, ErrorCode } from './error-definition';

export class CustomError extends Error {
  constructor(public readonly errorCode: ErrorCode) {
    super(ERROR_INFO[errorCode].message);
    this.name = 'CustomError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }
  }
}
