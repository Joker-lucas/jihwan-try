const ERROR_CODES = Object.freeze({
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  INVALID_INPUT: 'INVALID_INPUT',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  BAD_REQUEST: 'BAD_REQUEST',

  MISSING_REQUIRED_FIELDS: 'MISSING_REQUIRED_FIELDS',
  INVALID_REQUEST_BODY_FORMAT: 'INVALID_REQUEST_BODY_FORMAT',
  NICKNAME_LENGTH_INVALID: 'NICKNAME_LENGTH_INVALID',
  NICKNAME_CONTAINS_SPECIAL_CHARACTERS: 'NICKNAME_CONTAINS_SPECIAL_CHARACTERS',
  PASSWORD_TOO_SHORT: 'PASSWORD_TOO_SHORT',
  INVALID_AMOUNT: 'INVALID_AMOUNT',
  INVALID_YEAR: 'INVALID_YEAR',
  INVALID_MONTH: 'INVALID_MONTH',
  INVALID_CHALLENGE_TITLE: 'INVALID_CHALLENGE_TITLE',
  INVALID_REWARD_XP: 'INVALID_REWARD_XP',
  INVALID_DATE_FORMAT: 'INVALID_DATE_FORMAT',
  INVALID_DATE_VALUE: 'INVALID_DATE_VALUE',
  INVALID_LIMIT_DAY: 'INVALID_LIMIT_DAY',

  USER_NOT_FOUND: 'USER_NOT_FOUND',
  DUPLICATE_EMAIL: 'DUPLICATE_EMAIL',
  INVALID_PASSWORD: 'INVALID_PASSWORD',
  CHALLENGE_NOT_FOUND: 'CHALLENGE_NOT_FOUND',
  CHALLENGE_CHECKLIST_NOT_FOUND: 'CHALLENGE_CHECKLIST_NOT_FOUND',
  CHALLENGE_EXPIRED: 'CHALLENGE_EXPIRED',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  CHALLENGE_NOT_STARTED: 'CHALLENGE_NOT_STARTED',
  CHECKLIST_ALREADY_EXISTS: 'CHECKLIST_ALREADY_EXISTS',
  INVALID_DATE_RANGE: 'INVALID_DATE_RANGE',

  HTTP_RESPONSE_ERROR: 'HTTP_RESPONSE_ERROR',
  HTTP_REQUEST_TIMEOUT: 'HTTP_REQUEST_TIMEOUT',
  HTTP_NETWORK_ERROR: 'HTTP_NETWORK_ERROR',
  HTTP_REQUEST_SETUP_FAILED: 'HTTP_REQUEST_SETUP_FAILED',
});

const ERROR_INFO = {
  [ERROR_CODES.RESOURCE_NOT_FOUND]: { statusCode: 404, message: 'Resource not found.' },
  [ERROR_CODES.INVALID_INPUT]: { statusCode: 400, message: 'Invalid input.' },
  [ERROR_CODES.UNAUTHORIZED]: { statusCode: 401, message: 'Authentication is required.' },
  [ERROR_CODES.FORBIDDEN]: { statusCode: 403, message: 'Access denied. You do not have permission.' },
  [ERROR_CODES.BAD_REQUEST]: { statusCode: 400, message: 'Bad request.' },
  [ERROR_CODES.INTERNAL_SERVER_ERROR]: { statusCode: 500, message: 'An internal server error occurred.' },

  [ERROR_CODES.USER_NOT_FOUND]: { statusCode: 404, message: 'User not found.' },
  [ERROR_CODES.DUPLICATE_EMAIL]: { statusCode: 409, message: 'This email is already in use.' },
  [ERROR_CODES.INVALID_PASSWORD]: { statusCode: 401, message: 'Password does not match.' },

  [ERROR_CODES.CHALLENGE_NOT_FOUND]: { statusCode: 404, message: 'Challenge not found.' },
  [ERROR_CODES.CHALLENGE_EXPIRED]: { statusCode: 400, message: 'This challenge has already expired.' },
  [ERROR_CODES.CHALLENGE_NOT_STARTED]: { statusCode: 400, message: 'This challenge has not started yet.' },
  [ERROR_CODES.CHECKLIST_ALREADY_EXISTS]: { statusCode: 400, message: 'You have already joined this challenge.' },
  [ERROR_CODES.CHALLENGE_CHECKLIST_NOT_FOUND]: { statusCode: 404, message: 'Challenge checklist not found.' },

  [ERROR_CODES.MISSING_REQUIRED_FIELDS]: { statusCode: 400, message: 'Missing required fields.' },
  [ERROR_CODES.INVALID_REQUEST_BODY_FORMAT]: { statusCode: 400, message: 'Request body must be a valid JSON object.' },
  [ERROR_CODES.INVALID_DATE_RANGE]: { statusCode: 400, message: 'Start date must be earlier than end date.' },

  [ERROR_CODES.NICKNAME_LENGTH_INVALID]: { statusCode: 400, message: 'Nickname must be between 2 and 15 characters.' },
  [ERROR_CODES.NICKNAME_CONTAINS_SPECIAL_CHARACTERS]: { statusCode: 400, message: 'Nickname cannot contain special characters.' },
  [ERROR_CODES.PASSWORD_TOO_SHORT]: { statusCode: 400, message: 'Password must be at least 6 characters long.' },

  [ERROR_CODES.INVALID_AMOUNT]: { statusCode: 400, message: 'Amount must be a number greater than 0.' },
  [ERROR_CODES.INVALID_YEAR]: { statusCode: 400, message: 'Year is invalid.' },
  [ERROR_CODES.INVALID_MONTH]: { statusCode: 400, message: 'Month is invalid.' },
  [ERROR_CODES.INVALID_DATE_FORMAT]: { statusCode: 400, message: 'Date must be a valid string in YYYY-MM-DD format.' },
  [ERROR_CODES.INVALID_DATE_VALUE]: { statusCode: 400, message: 'Date is invalid.' },

  [ERROR_CODES.INVALID_CHALLENGE_TITLE]: { statusCode: 400, message: 'Challenge title must be a non-empty string.' },
  [ERROR_CODES.INVALID_REWARD_XP]: { statusCode: 400, message: 'Reward XP must be a non-negative number.' },
  [ERROR_CODES.INVALID_LIMIT_DAY]: { statusCode: 400, message: 'Limit day must be a non-negative integer.' },

  [ERROR_CODES.HTTP_RESPONSE_ERROR]: { statusCode: 500, message: 'An error occurred while communicating with an external service.' },
  [ERROR_CODES.HTTP_REQUEST_TIMEOUT]: { statusCode: 504, message: 'The request to an external service timed out.' },
  [ERROR_CODES.HTTP_NETWORK_ERROR]: { statusCode: 503, message: 'Could not connect to an external service.' },
  [ERROR_CODES.HTTP_REQUEST_SETUP_FAILED]: { statusCode: 500, message: 'An internal error occurred while setting up an external request.' },

};

module.exports = {
  ERROR_CODES,
  ERROR_INFO,
};
