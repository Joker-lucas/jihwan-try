const path = require('path');

const jwt = require('jsonwebtoken');

const { authService } = require('../services'); 
const { getLogger } = require('../libs/logger');
const { asyncLocalStorage } = require('../libs/middlewares/context');

const jwtSecret = 'jihwanproject';
const loggerPath = path.relative(process.cwd(), __filename);
const logger = getLogger(loggerPath);

const sleep = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });


const signUp = async (req, res) => {
  logger.info({ body: req.body }, '회원가입 요청 시작');
  try {
    const newUser = await authService.signUp(req.body);
    logger.info({ newUserId: newUser.userId }, '회원가입 성공');
    res.status(200).json(newUser);
  } catch (error) {
    logger.error(error, '회원가입 중 에러 발생');
  }
};

const signIn = async (req, res) => {
  logger.info('로그인 요청 시작');
  try {
    if (!req.user) {
      logger.warn('Passport 인증 실패');
      return res.status(401).json({ errorMsg: '인증 실패' });
    }

    const store = asyncLocalStorage.getStore();
    logger.info({ traceId: store?.get('traceId') }, '[START] 로그인 처리 시작, 5초 대기');

    await sleep(5000); 

    const storeAfterSleep = asyncLocalStorage.getStore();
    logger.info({ traceId: storeAfterSleep?.get('traceId') }, '[END] 5초 대기 완료, 응답 전송');
    
    if (req.originalUrl.includes('/jwt')) {
      const token = jwt.sign({ userId: req.user.userId }, jwtSecret, { expiresIn: '1m' } );
      logger.info('JWT 로그인 성공');
      return res.status(200).json({
        token: token,
        user: {
            userId: req.user.userId,
            nickname: req.user.nickname,
            email: req.user.contactEmail
        }
      });
    }
    logger.info('쿠키/세션 로그인 성공');
    return res.status(200).json({
      message: '로그인 성공',
      user: {
        userId: req.user.userId,
        nickname: req.user.nickname,
        email: req.user.contactEmail
      }
    
    });

  } catch(error){
    logger.error(error, '로그인 중 에러 발생');
    res.status(500).json({ errorMsg: '서버 오류' });
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
      res.status(200).json({ message: '성공적으로 로그아웃되었습니다.' });
    });
  });
};

module.exports = {
  signUp,
  signIn,
  signOut,
};