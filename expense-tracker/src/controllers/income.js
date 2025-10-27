const { incomeService } = require('../services');
const { getLogger } = require('../libs/logger');
const {
  response, authUtils, error, errorDefinition,
} = require('../libs/common');

const { successResponse } = response;
const { isAdmin } = authUtils;
const { CustomError } = error;
const { ERROR_CODES } = errorDefinition;

const logger = getLogger('controllers/income.js');

const getIncomes = async (req, res) => {
  const requester = req.user;
  const { year } = req.query;
  const { month } = req.query;

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

  const { totalCount, incomes } = await incomeService.getIncomes(
    targetUserId,
    year,
    month,
    limit,
    offset,
  );

  successResponse(res, {
    totalCount,
    incomes,
  });
};

const getIncomeById = async (req, res) => {
  const { userId } = req.user;
  const { incomeId } = req.params;

  const income = await incomeService.getIncomeById(userId, incomeId);

  successResponse(res, income);
};

const createIncome = async (req, res) => {
  const { userId } = req.user;
  const incomeData = req.body;

  const newIncome = await incomeService.createIncome(userId, incomeData);

  successResponse(res, newIncome, 201);
};

const updateIncome = async (req, res) => {
  const { userId } = req.user;
  const { incomeId } = req.params;
  const updateData = req.body;

  const updatedIncome = await incomeService.updateIncome(userId, incomeId, updateData);
  successResponse(res, updatedIncome);
};

const deleteIncome = async (req, res) => {
  try {
    const { userId } = req.user;
    const { incomeId } = req.params;

    await incomeService.deleteIncome(userId, incomeId);

    successResponse(res, { message: '수입 내역이 성공적으로 삭제되었습니다.' });
  } catch (e) {
    logger.error(e, '수입 내역 삭제 중 에러 발생');
    throw e;
  }
};

module.exports = {
  getIncomes,
  getIncomeById,
  createIncome,
  updateIncome,
  deleteIncome,
};
