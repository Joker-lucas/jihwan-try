const jwt = require('jsonwebtoken');

const { authService } = require('../services');
const { getLogger } = require('../libs/logger');
const { response, error, errorDefinition} = require('../libs/common');
const { successResponse } = response;
const { CustomError } = error;
const { ERROR_CODES } = errorDefinition;

const jwtSecret = 'jihwanproject';
const logger = getLogger('controllers/auth.js');

const signUp = async (req, res) => {
  logger.info({ body: req.body }, '회원가입 요청 시작');
  try { 
    const newUser = await authService.signUp(req.body);
    logger.info({ newUserId: newUser.userId }, '회원가입 성공');
    successResponse(res, newUser, 201);

  } catch (error) {
    logger.error(error, '회원가입 중 에러 발생');
    throw error;
  }
};

const signIn = async (req, res, next) => {
  logger.info('로그인 요청 시작');
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
    
    if (req.originalUrl.includes('/jwt')) {
      const token = jwt.sign({ userId: req.user.userId }, jwtSecret, { expiresIn: '1m' } );
      logger.info('JWT 로그인 성공');
      successResponse(res, { token, user: userPayload });
    }
    logger.info('쿠키/세션 로그인 성공');
    successResponse(res, { message: '로그인 성공', user: userPayload });

  } catch(error){
    logger.error(error, '로그인 중 에러 발생');
    throw error;
  }

};
const signOut = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      logger.error(err, 'req.logout 중 에러 발생');
      return next(err);
    }
    res.clearCookie('sssssssssid');
    

    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      logger.info('로그아웃 성공');
      successResponse(res, { message: '성공적으로 로그아웃되었습니다.' });
    });
  });
};


module.exports = {
  signUp,
  signIn,
  signOut,
};