'use strict';

const userFields = {
  requiredCreate: ['nickname', 'email', 'gender'],
  allowedCreate: ['nickname', 'email', 'gender', 'birthday'],
  allowedUpdate: ['nickname', 'email', 'birthday'],
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


const validateUserCreation = validateRequiredFields(userFields.requiredCreate);
const filterUserCreateBody = filterRequestBody(userFields.allowedCreate);
const filterUserUpdateBody = filterRequestBody(userFields.allowedUpdate);

module.exports = {
  validateUserCreation,
  filterUserCreateBody,
  filterUserUpdateBody,
};