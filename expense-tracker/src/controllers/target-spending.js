const { targetSpendingService } = require('../services');
const { getLogger } = require('../libs/logger');
const {
  response, authUtils, error, errorDefinition,
} = require('../libs/common');

const { successResponse } = response;
const { isAdmin } = authUtils;
const { CustomError } = error;
const { ERROR_CODES } = errorDefinition;

const logger = getLogger('controllers/targetSpending.js');

const getTargetSpendings = async (req, res) => {
  const requester = req.user;
  const { year } = req.query;
  const { month } = req.query;

  if (!year || !month) {
    throw new CustomError(ERROR_CODES.BAD_REQUEST);
  }

  if (!req.query.userId) {
    throw new CustomError(ERROR_CODES.BAD_REQUEST);
  }
  if (!isAdmin(requester)) {
    if (parseInt(req.query.userId, 10) !== requester.userId) {
      throw new CustomError(ERROR_CODES.FORBIDDEN);
    }
  }
  const targetUserId = parseInt(req.query.userId, 10);

  const page = parseInt(req.query.page || 1, 10);
  const limit = parseInt(req.query.limit || 10, 10);
  const offset = (page - 1) * limit;

  const { totalCount, targetSpendings } = await targetSpendingService.getTargetSpendings(
    targetUserId,
    year,
    month,
    limit,
    offset,
  );

  successResponse(res, {
    totalCount,
    targetSpendings,
  });
};

const getTargetSpendingById = async (req, res) => {
  const { userId } = req.user;
  const { targetSpendingId } = req.params;

  const target = await targetSpendingService.getTargetSpendingById(userId, targetSpendingId);

  successResponse(res, target);
};

const createTargetSpending = async (req, res) => {
  const { userId } = req.user;
  const targetData = req.body;

  const createdTarget = await targetSpendingService.createTargetSpending(userId, targetData);

  successResponse(res, createdTarget);
};

const updateTargetSpending = async (req, res) => {
  const { targetSpendingId } = req.params;
  const { userId } = req.user;
  const updateData = req.body;

  // eslint-disable-next-line max-len
  const updatedTarget = await targetSpendingService.updateTargetSpending(userId, targetSpendingId, updateData);

  successResponse(res, updatedTarget);
};

const deleteTargetSpending = async (req, res) => {
  try {
    const { targetSpendingId } = req.params;
    const { userId } = req.user;

    await targetSpendingService.deleteTargetSpending(userId, targetSpendingId);

    successResponse(res, { message: '월별 목표 지출이 성공적으로 삭제되었습니다.' });
  } catch (e) {
    logger.error(e, '월별 목표 지출 삭제 중 에러 발생');
    throw e;
  }
};

module.exports = {
  getTargetSpendings,
  getTargetSpendingById,
  createTargetSpending,
  updateTargetSpending,
  deleteTargetSpending,
};
