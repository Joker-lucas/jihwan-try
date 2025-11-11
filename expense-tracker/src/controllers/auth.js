require('dotenv').config();
const { authService } = require('../services');
const { userLogService } = require('../services/user-log');
const { response, error, errorDefinition } = require('../libs/common');
const { LOG_CODES } = require('../libs/constants/user-log');

const { successResponse } = response;
const { CustomError } = error;
const { ERROR_CODES } = errorDefinition;

const signUp = async (req, res) => {
  const context = {
    method: req.method,
    url: req.originalUrl,
  };

  const newUser = await authService.signUp(req.body);

  const newUserPayload = {
    nickname: newUser.nickname,
    email: newUser.contactEmail,
    profileImageUrl: newUser.profileImageUrl,
    gender: newUser.gender,
    birthday: newUser.birthday,
    level: newUser.level,
    exp: newUser.exp,
  };

  await userLogService.createLog({
    userId: newUser.userId,
    actionType: LOG_CODES.USER_SIGNUP,
    status: 'SUCCESS',
    details: {
      context,
      target: { userId: newUser.userId, email: newUser.contactEmail },
    },
  });

  successResponse(res, newUserPayload, 201);
};

const signIn = async (req, res) => {
  if (!req.user) {
    throw new CustomError(ERROR_CODES.UNAUTHORIZED);
  }

  const context = {
    method: req.method,
    url: req.originalUrl,
  };

  await userLogService.createLog({
    userId: req.user.userId,
    actionType: LOG_CODES.USER_LOGIN,
    status: 'SUCCESS',
    details: {
      context,
      target: { userId: req.user.userId, email: req.user.contactEmail },
    },
  });

  const userPayload = {
    userId: req.user.userId,
    nickname: req.user.nickname,
    email: req.user.contactEmail,
  };

  successResponse(res, { message: '로그인 성공', user: userPayload });
};

const signOut = async (req, res) => {
  const context = {
    method: req.method,
    url: req.originalUrl,
  };
  const { userId, contactEmail } = req.user;
  req.logout((err) => {
    if (err) {
      throw err;
    }
    res.clearCookie(process.env.SESSION_NAME);

    req.session.destroy(async (e) => {
      if (e) {
        throw e;
      }
      await userLogService.createLog({
        userId,
        actionType: LOG_CODES.USER_LOGOUT,
        status: 'SUCCESS',
        details: {
          context,
          target: { userId, email: contactEmail },
        },
      });
      return successResponse(res, { message: '성공적으로 로그아웃되었습니다.' });
    });
  });
};

module.exports = {
  signUp,
  signIn,
  signOut,
};
