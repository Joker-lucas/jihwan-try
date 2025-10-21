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

const validateRequiredFields = (requiredFields) => {
  return (req, res, next) => {
    const missingFields = [];
    for (const field of requiredFields) {
        if (!req.body[field]) {
            missingFields.push(field);
        }
    }

    if (missingFields.length > 0) {
        return res.status(400).json({ 
            errorMsg: `필수 필드 누락: ${missingFields.join(', ')}`
        });
    }
    next();
  };
};

const filterRequestBody = (allowedFields) => {
  return (req, res, next) => {
        if (typeof req.body !== 'object' || req.body === null || Array.isArray(req.body)) {
            return res.status(400).json({ errorMsg: '요청 본문이 객체 형식이 아닙니다.' });
        }

        const filteredBody = {};
        for (const field of Object.keys(req.body)) {
            if (allowedFields.includes(field)) {
                filteredBody[field] = req.body[field];
            }
        }
        req.body = filteredBody;
        next();
    };
};

const validateSignup = (req, res, next) => {
  const { nickname, password } = req.body;
  const specialCharacters = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

  if (nickname.length < 2 || nickname.length > 15) {
    return res.status(400).json({
      errorMsg: '닉네임은 2자 이상, 15자 이하로 입력해주세요.'
    });
  }
  if (specialCharacters.test(nickname)) {
    return res.status(400).json({
      errorMsg: '닉네임에 특수문자를 사용할 수 없습니다.'
    });
  }
  if (password.length < 6) {
    return res.status(400).json({
      errorMsg: '비밀번호는 6자 이상이어야 합니다.'
    });
  }
  next();
};

const validateIncomeData = (req, res, next) => {
  const { amount } = req.body;

  if (amount !== undefined && (typeof amount !== 'number' || amount <= 0)) {
    return res.status(400).json({
      errorMsg: '금액(amount)은 0보다 큰 숫자여야 합니다.'
    });
  }

  next();
}

const validateSignupRequired = validateRequiredFields(signupFields.required);
const filterSignupBody = filterRequestBody(signupFields.allowed);
const filterUserUpdateBody = filterRequestBody(userFields.allowed);

const validateIncomeRequired = validateRequiredFields(incomeFields.required);
const filterIncomeBody = filterRequestBody(incomeFields.allowed);


module.exports = {
  validateSignupRequired,
  validateSignup,
  filterSignupBody,
  filterUserUpdateBody,
  validateIncomeRequired,
  validateIncomeData,
  filterIncomeBody,
};