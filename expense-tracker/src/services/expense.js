const { Expense, FinancialYear, sequelize } = require('../libs/db/models');
const { error, errorDefinition } = require('../libs/common');

const { CustomError } = error;
const { ERROR_CODES } = errorDefinition;

const _getFinancialYearId = async (dateString, transaction) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  const [financialYear] = await FinancialYear.findOrCreate({
    where: { year, month },
    transaction,
  });

  return financialYear.financialYearId;
};

const getExpenses = async (userId, year, month, page, limit) => {
  const whereClause = {};

  whereClause.userId = userId;

  if (year && month) {
    const financialYear = await FinancialYear.findOne({
      where: { year: parseInt(year, 10), month: parseInt(month, 10) },
    });

    if (financialYear) {
      whereClause.financialYearId = financialYear.financialYearId;
    } else {
      return { totalCount: 0, expenses: [] };
    }
  }

  const offset = (page - 1) * limit;

  const { count, rows } = await Expense.findAndCountAll({
    where: whereClause,
    order: [['date', 'DESC']],
    limit,
    offset,
  });

  return {
    totalCount: count,
    expenses: rows,
  };
};

const getExpenseById = async (userId, expenseId) => {
  const expense = await Expense.findOne({
    where: {
      expenseId: parseInt(expenseId, 10),
      userId,
    },
  });

  if (!expense) {
    throw new CustomError(ERROR_CODES.NOT_FOUND);
  }

  return expense;
};

const createExpense = async (userId, expenseData) => {
  const {
    date, amount, category, status, description, paymentMethod,
  } = expenseData;
  const financialYearId = await _getFinancialYearId(date);

  const newExpense = await Expense.create({
    userId,
    financialYearId,
    date,
    amount,
    category,
    paymentMethod,
    status,
    description,
  });

  return newExpense;
};

const updateExpense = async (userId, expenseId, updateData) => {
  const {
    date, amount, category, status, description, paymentMethod,
  } = updateData;

  const t = await sequelize.transaction();
  try {
    const expense = await Expense.findOne({
      where: {
        expenseId: parseInt(expenseId, 10),
        userId,
      },
      transaction: t,
    });

    if (!expense) {
      throw new CustomError(ERROR_CODES.NOT_FOUND);
    }

    const newValues = {};
    if (date) newValues.date = date;
    if (amount) newValues.amount = amount;
    if (category) newValues.category = category;
    if (status) newValues.status = status;
    if (paymentMethod) newValues.paymentMethod = paymentMethod;
    if (description !== undefined) newValues.description = description;

    if (date && expense.date !== date) {
      newValues.financialYearId = await _getFinancialYearId(date, t);
    }

    await expense.update(newValues, { transaction: t });

    await t.commit();
    return expense;
  } catch (e) {
    await t.rollback();
    throw e;
  }
};

const deleteExpense = async (userId, expenseId) => {
  const deletedRows = await Expense.destroy({
    where: {
      expenseId: parseInt(expenseId, 10),
      userId,
    },
  });

  if (deletedRows === 0) {
    throw new CustomError(ERROR_CODES.NOT_FOUND);
  }

  return true;
};

module.exports = {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
};
