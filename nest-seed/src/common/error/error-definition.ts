export const ERROR_CODES = {
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  INVALID_INPUT: 'INVALID_INPUT',
  UNAUTHORIZED: 'UNAUTHORIZED',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  DUPLICATE_EMAIL: 'DUPLICATE_EMAIL',
  INVALID_PASSWORD: 'INVALID_PASSWORD',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
} as const;

export type ErrorCode = keyof typeof ERROR_CODES;

interface ErrorDetail {
  statusCode: number;
  message: string;
}

export const ERROR_INFO: Record<ErrorCode, ErrorDetail> = {
  [ERROR_CODES.RESOURCE_NOT_FOUND]: {
    statusCode: 404,
    message: '리소스를 찾을 수 없습니다.',
  },
  [ERROR_CODES.INVALID_INPUT]: {
    statusCode: 400,
    message: '입력값이 유효하지 않습니다.',
  },
  [ERROR_CODES.UNAUTHORIZED]: {
    statusCode: 401,
    message: '인증이 필요합니다.',
  },
  [ERROR_CODES.USER_NOT_FOUND]: {
    statusCode: 404,
    message: '사용자를 찾을 수 없습니다.',
  },
  [ERROR_CODES.DUPLICATE_EMAIL]: {
    statusCode: 409,
    message: '이미 사용 중인 이메일입니다.',
  },
  [ERROR_CODES.INVALID_PASSWORD]: {
    statusCode: 401,
    message: '비밀번호가 일치하지 않습니다.',
  },
  [ERROR_CODES.INTERNAL_SERVER_ERROR]: {
    statusCode: 500,
    message: '서버에 문제가 발생했습니다.',
  },
};
