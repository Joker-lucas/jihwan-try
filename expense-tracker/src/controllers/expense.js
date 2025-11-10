const { expenseService } = require('../services');
const { getLogger } = require('../libs/logger');
const {
  response, authUtils, error, errorDefinition,
} = require('../libs/common');

const { successResponse } = response;
const { isAdmin } = authUtils;
const { CustomError } = error;
const { ERROR_CODES } = errorDefinition;

const logger = getLogger('controllers/expense.js');

const getExpenses = async (req, res) => {
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

  const page = parseInt(req.query.page, 10);
  const limit = parseInt(req.query.limit, 10);

  const { totalCount, expenses } = await expenseService.getExpenses(
    targetUserId,
    year,
    month,
    page,
    limit,
  );

  successResponse(res, {
    totalCount,
    expenses,
  });
};

const getExpenseById = async (req, res) => {
  const { userId } = req.user;
  const { expenseId } = req.params;
  const expense = await expenseService.getExpenseById(userId, expenseId);

  successResponse(res, expense);
};

const createExpense = async (req, res) => {
  const { userId } = req.user;
  const expenseData = req.body;

  const newExpense = await expenseService.createExpense(userId, expenseData);

  successResponse(res, newExpense, 201);
};

const updateExpense = async (req, res) => {
  const { userId } = req.user;
  const { expenseId } = req.params;
  const updateData = req.body;

  const updatedExpense = await expenseService.updateExpense(userId, expenseId, updateData);

  successResponse(res, updatedExpense);
};

const deleteExpense = async (req, res) => {
  try {
    const { userId } = req.user;
    const { expenseId } = req.params;

    await expenseService.deleteExpense(userId, expenseId);

    successResponse(res, { message: '지출 내역이 성공적으로 삭제되었습니다.' });
  } catch (e) {
    logger.error(e, '지출 내역 삭제 중 에러 발생');
    throw e;
  }
};

module.exports = {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
};
