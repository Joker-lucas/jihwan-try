// const jwt = require('jsonwebtoken');
require('dotenv').config();
const { authService } = require('../services');
const { getLogger } = require('../libs/logger');
const { response, error, errorDefinition} = require('../libs/common');
const { successResponse } = response;
const { CustomError } = error;
const { ERROR_CODES } = errorDefinition;

const logger = getLogger('controllers/auth.js');

const signUp = async (req, res) => {
  try { 
    const newUser = await authService.signUp(req.body);

    const newUserPayload = {
      nickname: newUser.nickname,
      email: newUser.contactEmail,
      profileImageUrl: newUser.profileImageUrl,
      gender: newUser.gender,
      birthday: newUser.birthday,
      level: newUser.level,
      exp: newUser.exp
    };

    successResponse(res, newUserPayload, 201);

  } catch (error) {
    throw error;
  }
};

const signIn = async (req, res, next) => {
  try {
    if (!req.user) {
      logger.warn('Passport 인증 실패');
      throw new CustomError(ERROR_CODES.UNAUTHORIZED);
    }

    const userPayload = {
      userId: req.user.userId,
      nickname: req.user.nickname,
      email: req.user.contactEmail,
    };

    successResponse(res, { message: '로그인 성공', user: userPayload });

  } catch(error){
    throw error;
  }

};
const signOut = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.clearCookie(process.env.SESSION_NAME);
    

    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      successResponse(res, { message: '성공적으로 로그아웃되었습니다.' });
    });
  });
};


module.exports = {
  signUp,
  signIn,
  signOut,
};