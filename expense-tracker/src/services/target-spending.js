const { TargetSpending, FinancialYear, sequelize } = require('../libs/db/models');
const { error, errorDefinition } = require('../libs/common');

const { CustomError } = error;
const { ERROR_CODES } = errorDefinition;

const _getFinancialYearId = async (year, month, transaction) => {
  const [financialYear] = await FinancialYear.findOrCreate({
    where: { year: parseInt(year, 10), month: parseInt(month, 10) },
    transaction,
  });

  return financialYear.financialYearId;
};

const getTargetSpendings = async (userId, year, month, limit, offset) => {
  const whereClause = {};
  whereClause.userId = userId;

  if (year && month) {
    const financialYear = await FinancialYear.findOne({
      where: { year: parseInt(year, 10), month: parseInt(month, 10) },
    });

    if (financialYear) {
      whereClause.financialYearId = financialYear.financialYearId;
    } else {
      return { totalCount: 0, targetSpendings: [] };
    }
  }

  const { count, rows } = await TargetSpending.findAndCountAll({
    where: whereClause,
    order: [['category', 'DESC']],
    limit,
    offset,
  });

  return {
    totalCount: count,
    targetSpendings: rows,
  };
};

const getTargetSpendingById = async (userId, targetSpendingId) => {
  const target = await TargetSpending.findOne({
    where: {
      targetSpendingId: parseInt(targetSpendingId, 10),
      userId,
    },
  });

  if (!target) {
    throw new CustomError(ERROR_CODES.NOT_FOUND);
  }

  return target;
};

const createTargetSpending = async (userId, targetData) => {
  const {
    year, month, category, amount, description,
  } = targetData;
  const financialYearId = await _getFinancialYearId(year, month);

  const newTarget = await TargetSpending.create({
    userId,
    financialYearId,
    category,
    amount,
    description,
  });

  return newTarget;
};

const updateTargetSpending = async (userId, targetSpendingId, updateData) => {
  const { amount, description, category } = updateData;

  const t = await sequelize.transaction();
  try {
    const target = await TargetSpending.findOne({
      where: {
        targetSpendingId: parseInt(targetSpendingId, 10),
        userId,
      },
      transaction: t,
    });

    if (!target) {
      throw new CustomError(ERROR_CODES.NOT_FOUND);
    }

    const newValues = {};
    if (amount) newValues.amount = amount;
    if (category) newValues.category = category;
    if (description !== undefined) newValues.description = description;

    await target.update(newValues, { transaction: t });

    await t.commit();
    return target;
  } catch (e) {
    await t.rollback();
    throw e;
  }
};

const deleteTargetSpending = async (userId, targetSpendingId) => {
  const deletedRows = await TargetSpending.destroy({
    where: {
      targetSpendingId: parseInt(targetSpendingId, 10),
      userId,
    },
  });

  if (deletedRows === 0) {
    throw new CustomError(ERROR_CODES.NOT_FOUND);
  }

  return true;
};

module.exports = {
  getTargetSpendings,
  getTargetSpendingById,
  createTargetSpending,
  updateTargetSpending,
  deleteTargetSpending,
};
