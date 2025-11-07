const { Income, FinancialYear, sequelize } = require('../libs/db/models');
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

const getIncomes = async (userId, year, month, page, limit) => {
  const whereClause = {};

  whereClause.userId = userId;

  if (year && month) {
    const financialYear = await FinancialYear.findOne({
      where: { year: parseInt(year, 10), month: parseInt(month, 10) },
    });

    if (financialYear) {
      whereClause.financialYearId = financialYear.financialYearId;
    } else {
      return { totalCount: 0, incomes: [] };
    }
  }
  const offset = (page - 1) * limit;

  const { count, rows } = await Income.findAndCountAll({
    where: whereClause,
    order: [['date', 'DESC']],
    limit,
    offset,
  });

  return {
    totalCount: count,
    incomes: rows,
  };
};

const getIncomeById = async (userId, incomeId) => {
  const income = await Income.findOne({
    where: {
      incomeId: parseInt(incomeId, 10),
      userId,
    },
  });

  if (!income) {
    throw new CustomError(ERROR_CODES.NOT_FOUND);
  }

  return income;
};

const createIncome = async (userId, incomeData) => {
  const {
    date, amount, category, status, description,
  } = incomeData;
  const financialYearId = await _getFinancialYearId(date);

  const newIncome = await Income.create({
    userId,
    financialYearId,
    date,
    amount,
    category,
    status,
    description,
  });

  return newIncome;
};

const updateIncome = async (userId, incomeId, updateData) => {
  const {
    date, amount, category, status, description,
  } = updateData;

  const t = await sequelize.transaction();
  try {
    const income = await Income.findOne({
      where: {
        incomeId: parseInt(incomeId, 10),
        userId,
      },
      transaction: t,
    });

    if (!income) {
      throw new CustomError(ERROR_CODES.NOT_FOUND);
    }

    const newValues = {};
    if (date) newValues.date = date;
    if (amount) newValues.amount = amount;
    if (category) newValues.category = category;
    if (status) newValues.status = status;
    if (description !== undefined) newValues.description = description;

    if (date && income.date !== date) {
      newValues.financialYearId = await _getFinancialYearId(date, t);
    }

    await income.update(newValues, { transaction: t });

    await t.commit();
    return income;
  } catch (e) {
    await t.rollback();
    throw e;
  }
};

const deleteIncome = async (userId, incomeId) => {
  const deletedRows = await Income.destroy({
    where: {
      incomeId: parseInt(incomeId, 10),
      userId,
    },
  });

  if (deletedRows === 0) {
    throw new CustomError(ERROR_CODES.NOT_FOUND);
  }

  return true;
};

module.exports = {
  createIncome,
  getIncomes,
  getIncomeById,
  updateIncome,
  deleteIncome,
};
