const { CustomError } = require('../common/error');
const { ERROR_CODES } = require('../common/error-definition');

const userFields = {
  allowed: ['nickname', 'contactEmail', 'birthday'],
};

const signupFields = {
  required: ['nickname', 'gender', 'email', 'password'],
  allowed: ['nickname', 'email', 'gender', 'birthday', 'password'],
};

const incomeFields = {
  required: ['date', 'amount', 'category'],
  allowed: ['date', 'amount', 'category', 'status', 'description'],
};

const targetSpendingFields = {
  required: ['year', 'month', 'category', 'amount'],
  allowed: ['year', 'month', 'category', 'amount', 'description'],
};

const expenseFields = {
  required: ['date', 'amount', 'category'],
  allowed: ['date', 'amount', 'category', 'status', 'description', 'paymentMethod'],
};

const challengeFields = {
  required: ['title', 'rewardXp', 'challengeType', 'targetValue'],
  allowed: ['title', 'description', 'rewardXp', 'challengeStartDate', 'challengeExpireDate', 'limitDay', 'challengeType', 'targetValue'],
};

const validateRequiredFields = (requiredFields) => (req, res, next) => {
  const missingFields = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const field of requiredFields) {
    if (!req.body[field]) {
      missingFields.push(field);
    }
  }

  if (missingFields.length > 0) {
    throw new CustomError(ERROR_CODES.MISSING_REQUIRED_FIELDS);
  }
  next();
};

const filterRequestBody = (allowedFields) => (req, res, next) => {
  if (typeof req.body !== 'object' || req.body === null || Array.isArray(req.body)) {
    throw new CustomError(ERROR_CODES.INVALID_REQUEST_BODY_FORMAT);
  }

  const filteredBody = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const field of Object.keys(req.body)) {
    if (allowedFields.includes(field)) {
      filteredBody[field] = req.body[field];
    }
  }
  req.body = filteredBody;
  next();
};

const validateSignup = (req, res, next) => {
  const { nickname, password } = req.body;
  const specialCharacters = /[`!@#$%^&*()_+=~[\]{};':"\\|,.<>/?-]/;

  if (nickname.length < 2 || nickname.length > 15) {
    throw new CustomError(ERROR_CODES.NICKNAME_LENGTH_INVALID);
  }
  if (specialCharacters.test(nickname)) {
    throw new CustomError(ERROR_CODES.NICKNAME_CONTAINS_SPECIAL_CHARACTERS);
  }
  if (password.length < 6) {
    throw new CustomError(ERROR_CODES.PASSWORD_TOO_SHORT);
  }
  next();
};

const validateAmount = (req, res, next) => {
  const { amount } = req.body;

  if (amount !== undefined && (typeof amount !== 'number' || amount <= 0)) {
    throw new CustomError(ERROR_CODES.INVALID_AMOUNT);
  }

  next();
};

const validateTargetSpendingData = (req, res, next) => {
  const { amount, year, month } = req.body;
  const currentYear = new Date().getFullYear();

  if (amount !== undefined && (typeof amount !== 'number' || amount <= 0)) {
    throw new CustomError(ERROR_CODES.INVALID_AMOUNT);
  }

  if (year !== undefined) {
    if (typeof year !== 'number' || year < 2000 || year > currentYear + 10) {
      throw new CustomError(ERROR_CODES.INVALID_YEAR);
    }
  }

  if (month !== undefined) {
    if (typeof month !== 'number' || month < 1 || month > 12) {
      throw new CustomError(ERROR_CODES.INVALID_MONTH);
    }
  }

  next();
};

const validateChallengeData = (req, res, next) => {
  const {
    title, rewardXp, challengeStartDate, challengeExpireDate, limitDay,
  } = req.body;

  if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
    throw new CustomError(ERROR_CODES.INVALID_CHALLENGE_TITLE);
  }

  if (rewardXp !== undefined && (typeof rewardXp !== 'number' || rewardXp < 0)) {
    throw new CustomError(ERROR_CODES.INVALID_REWARD_XP);
  }

  if (challengeStartDate !== undefined && challengeStartDate !== null) {
    if (typeof challengeStartDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(challengeStartDate)) {
      throw new CustomError(ERROR_CODES.INVALID_DATE_FORMAT);
    }
    if (Number.isNaN(new Date(challengeStartDate).getTime())) {
      throw new CustomError(ERROR_CODES.INVALID_DATE_VALUE);
    }
  }

  if (challengeExpireDate !== undefined && challengeExpireDate !== null) {
    if (typeof challengeExpireDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(challengeExpireDate)) {
      throw new CustomError(ERROR_CODES.INVALID_DATE_FORMAT);
    }
    if (Number.isNaN(new Date(challengeExpireDate).getTime())) {
      throw new CustomError(ERROR_CODES.INVALID_DATE_VALUE);
    }
  }

  if (challengeStartDate && challengeExpireDate) {
    const start = new Date(challengeStartDate);
    const expire = new Date(challengeExpireDate);
    if (start > expire) {
      throw new CustomError(ERROR_CODES.INVALID_DATE_RANGE);
    }
  }

  if (limitDay !== undefined && (typeof limitDay !== 'number' || limitDay < 0 || !Number.isInteger(limitDay))) {
    throw new CustomError(ERROR_CODES.INVALID_LIMIT_DAY);
  }

  next();
};

const validateSignupRequired = validateRequiredFields(signupFields.required);
const filterSignupBody = filterRequestBody(signupFields.allowed);
const filterUserUpdateBody = filterRequestBody(userFields.allowed);

const validateIncomeRequired = validateRequiredFields(incomeFields.required);
const filterIncomeBody = filterRequestBody(incomeFields.allowed);

const validateTargetSpendingRequired = validateRequiredFields(targetSpendingFields.required);
const filterTargetSpendingBody = filterRequestBody(targetSpendingFields.allowed);

const validateExpenseRequired = validateRequiredFields(expenseFields.required);
const filterExpenseBody = filterRequestBody(expenseFields.allowed);

const validateChallengeRequired = validateRequiredFields(challengeFields.required);
const filterChallengeBody = filterRequestBody(challengeFields.allowed);

module.exports = {
  validateSignupRequired,
  validateSignup,
  filterSignupBody,
  filterUserUpdateBody,

  validateAmount,

  validateIncomeRequired,
  filterIncomeBody,

  validateTargetSpendingRequired,
  validateTargetSpendingData,
  filterTargetSpendingBody,

  validateExpenseRequired,
  filterExpenseBody,

  validateChallengeRequired,
  filterChallengeBody,
  validateChallengeData,
};
