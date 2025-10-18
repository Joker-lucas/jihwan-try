const { userService } = require('../services'); 
const { response, error, errorDefinition } = require('../libs/common');
const { getLogger } = require('../libs/logger');
const { successResponse } = response;
const { CustomError } = error;
const { ERROR_CODES } = errorDefinition;

const logger = getLogger('controllers/userController.js');

const getMyProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    logger.info('내 프로필 조회 요청');

    const user = await userService.getUserById(userId);
    
    if (!user) {
      throw new CustomError(ERROR_CODES.USER_NOT_FOUND);
    }
    
    const userPayload = {
      nickname: user.nickname,
      contactEmail: user.contactEmail,
      profileImageUrl: user.profileImageUrl,
      gender: user.gender,
      birthday: user.birthday,
      level: user.level,
      exp: user.exp
    };


    successResponse(res, userPayload);
  } catch (error) {
    logger.error(error, '내 프로필 조회 중 에러 발생');
    throw error;
  }
};

const updateMyProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    logger.info({ userId, body: req.body }, '내 프로필 수정 요청');

    const updatedUser = await userService.updateUserById(userId, req.body);

    if (!updatedUser) {
      throw new CustomError(ERROR_CODES.USER_NOT_FOUND);      
    }

    const updateUserPayload = {
      nickname: updatedUser.nickname,
      contactEmail: updatedUser.contactEmail,
      profileImageUrl: updatedUser.profileImageUrl,
      gender: updatedUser.gender,
      birthday: updatedUser.birthday,
    };
    successResponse(res, updateUserPayload);
  } catch (error) {
    logger.error(error, '내 프로필 수정 중 에러 발생');
    throw error;
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
};