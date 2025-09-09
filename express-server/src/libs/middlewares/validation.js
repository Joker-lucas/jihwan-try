const userFields = {
  allowed: ['nickname', 'contactEmail', 'birthday'],
};


const signupFields = {
  required: ['nickname', 'gender', 'loginEmail', 'password'],
  allowed: ['nickname', 'loginEmail', 'contactEmail', 'gender', 'birthday', 'password'],
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


const validateSignup = validateRequiredFields(signupFields.required);
const filterSignupBody = filterRequestBody(signupFields.allowed);

const filterUserUpdateBody = filterRequestBody(userFields.allowed);

module.exports = {
  validateSignup,
  filterSignupBody,
  filterUserUpdateBody,
};