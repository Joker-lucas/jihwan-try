const { userService } = require('../services');
const { userLogService } = require('../services/user-log');
const {
  response, error, errorDefinition, authUtils,
} = require('../libs/common');
const { LOG_CODES } = require('../libs/constants/user-log');

const { successResponse } = response;
const { CustomError } = error;
const { ERROR_CODES } = errorDefinition;
const { isAdmin, isSelfOrAdmin } = authUtils;

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
  const context = {
    method: req.method,
    url: req.originalUrl,
  };

  try {
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

    const updatedUser = await userService.updateUserById(targetUserId, updateData);

    if (requester.role === 'admin' && requester.userId !== parseInt(targetUserId, 10)) {
      await userLogService.createLog({
        userId: requester.userId,
        actionType: LOG_CODES.UPDATE_USER,
        status: 'SUCCESS',
        details: {
          context,
          actor: { id: requester.userId, email: requester.contactEmail },
          target: { id: targetUserId, email: updatedUser.contactEmail },
        },
      });
    }

    const updateUserAllPayload = {
      nickname: updatedUser.nickname,
      contactEmail: updatedUser.contactEmail,
      profileImageUrl: updatedUser.profileImageUrl,
      gender: updatedUser.gender,
      birthday: updatedUser.birthday,
      role: updatedUser.role,
    };

    successResponse(res, updateUserAllPayload);
  } catch (e) {
    if (requester.role === 'admin' && requester.userId !== parseInt(targetUserId, 10)) {
      await userLogService.createLog({
        userId: requester.userId,
        actionType: LOG_CODES.UPDATE_USER,
        status: 'FAILURE',
        details: {
          context,
          actor: { id: requester.userId, email: requester.contactEmail },
          target: { id: targetUserId, email: (await userService.getUserById(targetUserId))?.contactEmail || 'unknown' },
          error: e.message,
        },
      });
    }
    throw e;
  }
};

const deleteUserById = async (req, res) => {
  const requester = req.user;
  const targetUserId = req.params.userId;
  const context = {
    method: req.method,
    url: req.originalUrl,
  };

  try {
    if (!isSelfOrAdmin(requester, targetUserId)) {
      throw new CustomError(ERROR_CODES.FORBIDDEN);
    }

    const userExists = await userService.getUserById(targetUserId);
    if (!userExists) {
      throw new CustomError(ERROR_CODES.USER_NOT_FOUND);
    }

    await userService.deleteUserById(targetUserId);

    if (requester.role === 'admin' && requester.userId !== parseInt(targetUserId, 10)) {
      await userLogService.createLog({
        userId: requester.userId,
        actionType: LOG_CODES.DELETE_USER,
        status: 'SUCCESS',
        details: {
          context,
          actor: { id: requester.userId, email: requester.contactEmail },
          target: { id: targetUserId, email: userExists.contactEmail },
        },
      });
    }

    successResponse(res, { message: '성공적으로 삭제되었습니다.' });
  } catch (e) {
    if (requester.role === 'admin' && requester.userId !== parseInt(targetUserId, 10)) {
      await userLogService.createLog({
        userId: requester.userId,
        actionType: LOG_CODES.DELETE_USER,
        status: 'FAILURE',
        details: {
          context,
          actor: { id: requester.userId, email: requester.contactEmail },
          target: { id: targetUserId, email: (await userService.getUserById(targetUserId))?.contactEmail || 'unknown' },
          error: e.message,
        },
      });
    }
    throw e;
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,

};
