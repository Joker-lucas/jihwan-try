const { userService } = require('../services');
const {
  response, error, errorDefinition, authUtils,
} = require('../libs/common');

const { getLogger } = require('../libs/logger');

const { successResponse } = response;
const { CustomError } = error;
const { ERROR_CODES } = errorDefinition;
const { isAdmin, isSelfOrAdmin } = authUtils;

const logger = getLogger('controllers/user.js');

const getAllUsers = async (req, res) => {
  if (!isAdmin(req.user)) {
    throw new CustomError(ERROR_CODES.FORBIDDEN);
  }

  const { search } = req.query;
  const { searchBy } = req.query;

  const page = parseInt(req.query.page, 10);
  const limit = parseInt(req.query.limit, 10);

  const { totalItems, users } = await userService.getAllUsers({
    search,
    searchBy,
    page,
    limit,
  });

  const usersPayload = users.map((user) => ({
    nickname: user.nickname,
    contactEmail: user.contactEmail,
    profileImageUrl: user.profileImageUrl,
    gender: user.gender,
    birthday: user.birthday,
    level: user.level,
    exp: user.exp,
    role: user.role,
  }));

  successResponse(res, {
    usersPayload,
    totalItems,
  });
};

const getUserById = async (req, res) => {
  const requester = req.user;
  const targetUserId = req.params.userId;

  if (!isSelfOrAdmin(requester, targetUserId)) {
    throw new CustomError(ERROR_CODES.FORBIDDEN);
  }

  const user = await userService.getUserById(targetUserId);

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
    exp: user.exp,
    role: user.role,
  };

  successResponse(res, userPayload);
};

const updateUserById = async (req, res) => {
  const requester = req.user;
  const targetUserId = req.params.userId;
  const updateData = req.body;

  if (!isSelfOrAdmin(requester, targetUserId)) {
    throw new CustomError(ERROR_CODES.FORBIDDEN);
  }

  const user = await userService.getUserById(targetUserId);

  if (!user) {
    throw new CustomError(ERROR_CODES.USER_NOT_FOUND);
  }

  if (updateData.role && !isAdmin(requester)) {
    throw new CustomError(ERROR_CODES.FORBIDDEN);
  }

  await userService.updateUserById(targetUserId, updateData);

  const updateUserAllPayload = {
    nickname: user.nickname,
    contactEmail: user.contactEmail,
    profileImageUrl: user.profileImageUrl,
    gender: user.gender,
    birthday: user.birthday,
    role: user.role,
  };

  successResponse(res, updateUserAllPayload);
};

const deleteUserById = async (req, res) => {
  try {
    const requester = req.user;
    const targetUserId = req.params.userId;

    if (!isSelfOrAdmin(requester, targetUserId)) {
      throw new CustomError(ERROR_CODES.FORBIDDEN);
    }

    const userExists = await userService.getUserById(targetUserId);
    if (!userExists) {
      throw new CustomError(ERROR_CODES.USER_NOT_FOUND);
    }

    await userService.deleteUserById(targetUserId);

    successResponse(res, { message: '성공적으로 삭제되었습니다.' });
  } catch (e) {
    logger.error(e, '월별 목표 지출 삭제 중 에러 발생');
    throw e;
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,

};
