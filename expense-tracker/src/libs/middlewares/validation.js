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

// eslint-disable-next-line consistent-return
const validateRequiredFields = (requiredFields) => (req, res, next) => {
  const missingFields = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const field of requiredFields) {
    if (!req.body[field]) {
      missingFields.push(field);
    }
  }

  if (missingFields.length > 0) {
    return res.status(400).json({
      errorMsg: `필수 필드 누락: ${missingFields.join(', ')}`,
    });
  }
  next();
};
// eslint-disable-next-line consistent-return
const filterRequestBody = (allowedFields) => (req, res, next) => {
  if (typeof req.body !== 'object' || req.body === null || Array.isArray(req.body)) {
    return res.status(400).json({ errorMsg: '요청 본문이 객체 형식이 아닙니다.' });
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
// eslint-disable-next-line consistent-return
const validateSignup = (req, res, next) => {
  const { nickname, password } = req.body;
  const specialCharacters = /[`!@#$%^&*()_+-=[]{};':"\\|,.<>\/?~]/;

  if (nickname.length < 2 || nickname.length > 15) {
    return res.status(400).json({
      errorMsg: '닉네임은 2자 이상, 15자 이하로 입력해주세요.',
    });
  }
  if (specialCharacters.test(nickname)) {
    return res.status(400).json({
      errorMsg: '닉네임에 특수문자를 사용할 수 없습니다.',
    });
  }
  if (password.length < 6) {
    return res.status(400).json({
      errorMsg: '비밀번호는 6자 이상이어야 합니다.',
    });
  }
  next();
};

// 미들웨어에는 return이 없는 경우도 있으니 예외처리
// eslint-disable-next-line consistent-return
const validateAmount = (req, res, next) => {
  const { amount } = req.body;

  if (amount !== undefined && (typeof amount !== 'number' || amount <= 0)) {
    return res.status(400).json({
      errorMsg: '금액(amount)은 0보다 큰 숫자여야 합니다.',
    });
  }

  next();
};
// eslint-disable-next-line consistent-return
const validateTargetSpendingData = (req, res, next) => {
  const { amount, year, month } = req.body;
  const currentYear = new Date().getFullYear();

  if (amount !== undefined && (typeof amount !== 'number' || amount <= 0)) {
    return res.status(400).json({
      errorMsg: '금액(amount)은 0보다 큰 숫자여야 합니다.',
    });
  }

  if (year !== undefined) {
    if (typeof year !== 'number' || year < 2000 || year > currentYear + 10) {
      return res.status(400).json({
        errorMsg: `연도(year)는 2000년부터 ${currentYear + 10} 사이의 숫자여야 합니다.`,
      });
    }
  }

  if (month !== undefined) {
    if (typeof month !== 'number' || month < 1 || month > 12) {
      return res.status(400).json({
        errorMsg: '월(month)은 1부터 12 사이의 숫자여야 합니다.',
      });
    }
  }

  next();
};
// eslint-disable-next-line consistent-return
const validateChallengeData = (req, res, next) => {
  const {
    title, rewardXp, challengeStartDate, challengeExpireDate, limitDay,
  } = req.body;

  if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
    return res.status(400).json({ errorMsg: '챌린지 제목(title)은 비어 있지 않은 문자열이어야 합니다.' });
  }

  if (rewardXp !== undefined && (typeof rewardXp !== 'number' || rewardXp < 0)) {
    return res.status(400).json({ errorMsg: '보상 경험치(rewardXp)는 0 이상의 숫자여야 합니다.' });
  }

  if (challengeStartDate !== undefined && challengeStartDate !== null) {
    if (typeof challengeStartDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(challengeStartDate)) {
      return res.status(400).json({ errorMsg: '챌린지 시작일(challengeStartDate)은 YYYY-MM-DD 형식의 유효한 날짜 문자열이어야 합니다.' });
    }
    if (Number.isNaN(new Date(challengeStartDate).getTime())) {
      return res.status(400).json({ errorMsg: '챌린지 시작일(challengeStartDate)이 유효한 날짜가 아닙니다.' });
    }
  }

  if (challengeExpireDate !== undefined && challengeExpireDate !== null) {
    if (typeof challengeExpireDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(challengeExpireDate)) {
      return res.status(400).json({ errorMsg: '챌린지 종료일(challengeExpireDate)은 YYYY-MM-DD 형식의 유효한 날짜 문자열이어야 합니다.' });
    }
    if (Number.isNaN(new Date(challengeExpireDate).getTime())) {
      return res.status(400).json({ errorMsg: '챌린지 종료일(challengeExpireDate)이 유효한 날짜가 아닙니다.' });
    }
  }

  if (challengeStartDate && challengeExpireDate) {
    const start = new Date(challengeStartDate);
    const expire = new Date(challengeExpireDate);
    if (start > expire) {
      return res.status(400).json({ errorMsg: '챌린지 시작일(challengeStartDate)은 종료일(challengeExpireDate)보다 빠를 수 없습니다.' });
    }
  }

  if (limitDay !== undefined && (typeof limitDay !== 'number' || limitDay < 0 || !Number.isInteger(limitDay))) {
    return res.status(400).json({ errorMsg: '제한 시간(limitDay)은 0 이상의 정수여야 합니다.' });
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
