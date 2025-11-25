const { Op } = require('sequelize');
const {
  Report, ReportType, Income, Expense, FinancialYear, User,
} = require('../libs/db/models');
const { reportConstants } = require('../libs/constants');
const { error, errorDefinition } = require('../libs/common');

const { CustomError } = error;
const { ERROR_CODES } = errorDefinition;

const _getFinancialYear = async (date) => {
  const financialYear = await FinancialYear.findOne({
    where: { startDate: { [Op.lte]: date }, endDate: { [Op.gte]: date } },
  });
  if (!financialYear) {
    throw new CustomError(ERROR_CODES.RESOURCE_NOT_FOUND);
  }
  return financialYear;
};

const _reportTypeCache = new Map();
const _getReportTypeId = async (type) => {
  if (_reportTypeCache.has(type)) { return _reportTypeCache.get(type); }
  const reportType = await ReportType.findOne({ where: { type } });
  if (!reportType) {
    throw new CustomError(ERROR_CODES.REPORT_TYPE_NOT_FOUND);
  }
  _reportTypeCache.set(type, reportType.reportTypeId);
  return reportType.reportTypeId;
};

async function generateTotalIncomeReport(date) {
  const users = await User.findAll({ attributes: ['userId'] });
  const tasks = users.map(async (user) => {
    const { userId } = user;
    const targetDate = new Date(date);
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth();
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    const financialYear = await _getFinancialYear(startDate);
    const whereClause = { userId, date: { [Op.gte]: startDate, [Op.lte]: endDate } };
    const totalIncome = await Income.sum('amount', { where: whereClause }) || 0;
    const reportTypeId = await _getReportTypeId(reportConstants.REPORT_TYPE.MONTHLY_TOTAL_INCOME);

    await Report.create({
      userId,
      financialYearId: financialYear.financialYearId,
      reportTypeId,
      value: String(totalIncome),
    });
  });
  await Promise.all(tasks);
}

async function generateTotalExpenseReport(date) {
  const users = await User.findAll({ attributes: ['userId'] });
  const tasks = users.map(async (user) => {
    const { userId } = user;
    const targetDate = new Date(date);
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth();
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    const financialYear = await _getFinancialYear(startDate);
    const whereClause = { userId, date: { [Op.gte]: startDate, [Op.lte]: endDate } };
    const totalExpense = await Expense.sum('amount', { where: whereClause }) || 0;
    const reportTypeId = await _getReportTypeId(reportConstants.REPORT_TYPE.MONTHLY_TOTAL_EXPENSE);

    await Report.create({
      userId,
      financialYearId: financialYear.financialYearId,
      reportTypeId,
      value: String(totalExpense),
    });
  });
  await Promise.all(tasks);
}

async function generatePrevMonthIncomeChangeReport(date) {
  const users = await User.findAll({ attributes: ['userId'] });
  const tasks = users.map(async (user) => {
    const { userId } = user;
    const targetDate = new Date(date);
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth();
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    const prevStartDate = new Date(year, month - 1, 1);
    const prevEndDate = new Date(year, month, 0);

    const financialYear = await _getFinancialYear(startDate);
    const whereClause = { userId, date: { [Op.gte]: startDate, [Op.lte]: endDate } };
    const prevWhereClause = { userId, date: { [Op.gte]: prevStartDate, [Op.lte]: prevEndDate } };

    const totalIncome = await Income.sum('amount', { where: whereClause }) || 0;
    const prevTotalIncome = await Income.sum('amount', { where: prevWhereClause }) || 0;

    const change = prevTotalIncome === 0 ? 0 : (
      (totalIncome - prevTotalIncome) / prevTotalIncome) * 100;

    const reportTypeId = await _getReportTypeId(
      reportConstants.REPORT_TYPE.PREV_MONTH_INCOME_CHANGE,
    );

    await Report.create({
      userId,
      financialYearId: financialYear.financialYearId,
      reportTypeId,
      value: change.toFixed(2),
    });
  });
  await Promise.all(tasks);
}

async function generatePrevMonthExpenseChangeReport(date) {
  const users = await User.findAll({ attributes: ['userId'] });
  const tasks = users.map(async (user) => {
    const { userId } = user;
    const targetDate = new Date(date);
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth();
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    const prevStartDate = new Date(year, month - 1, 1);
    const prevEndDate = new Date(year, month, 0);

    const financialYear = await _getFinancialYear(startDate);
    const whereClause = { userId, date: { [Op.gte]: startDate, [Op.lte]: endDate } };
    const prevWhereClause = { userId, date: { [Op.gte]: prevStartDate, [Op.lte]: prevEndDate } };

    const totalExpense = await Expense.sum('amount', { where: whereClause }) || 0;
    const prevTotalExpense = await Expense.sum('amount', { where: prevWhereClause }) || 0;

    const change = prevTotalExpense === 0 ? 0 : (
      (totalExpense - prevTotalExpense) / prevTotalExpense) * 100;

    const reportTypeId = await _getReportTypeId(
      reportConstants.REPORT_TYPE.PREV_MONTH_EXPENSE_CHANGE,
    );

    await Report.create({
      userId,
      financialYearId: financialYear.financialYearId,
      reportTypeId,
      value: change.toFixed(2),
    });
  });
  await Promise.all(tasks);
}

async function generateExpenseRatioByCategoryReport(date) {
  const users = await User.findAll({ attributes: ['userId'] });
  const tasks = users.map(async (user) => {
    const { userId } = user;
    const targetDate = new Date(date);
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth();
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    const financialYear = await _getFinancialYear(startDate);
    const whereClause = { userId, date: { [Op.gte]: startDate, [Op.lte]: endDate } };

    const totalExpense = await Expense.sum('amount', { where: whereClause }) || 0;
    const expenseByCategory = await Expense.findAll({
      attributes: ['category', [Report.sequelize.fn('SUM', Report.sequelize.col('amount')), 'total']],
      where: whereClause,
      group: ['category'],
      raw: true,
    });

    const ratioByCategory = expenseByCategory.reduce((acc, cur) => {
      const ratio = totalExpense === 0 ? 0 : (cur.total / totalExpense) * 100;
      acc[cur.category] = ratio.toFixed(2);
      return acc;
    }, {});

    const reportTypeId = await _getReportTypeId(
      reportConstants.REPORT_TYPE.EXPENSE_RATIO_BY_CATEGORY,
    );

    await Report.create({
      userId,
      financialYearId: financialYear.financialYearId,
      reportTypeId,
      value: JSON.stringify(ratioByCategory),
    });
  });
  await Promise.all(tasks);
}

async function generateIncomeRatioByCategoryReport(date) {
  const users = await User.findAll({ attributes: ['userId'] });
  const tasks = users.map(async (user) => {
    const { userId } = user;
    const targetDate = new Date(date);
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth();
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    const financialYear = await _getFinancialYear(startDate);
    const whereClause = { userId, date: { [Op.gte]: startDate, [Op.lte]: endDate } };

    const totalIncome = await Income.sum('amount', { where: whereClause }) || 0;
    const incomeByCategory = await Income.findAll({
      attributes: ['category', [Report.sequelize.fn('SUM', Report.sequelize.col('amount')), 'total']],
      where: whereClause,
      group: ['category'],
      raw: true,
    });

    const ratioByCategory = incomeByCategory.reduce((acc, cur) => {
      const ratio = totalIncome === 0 ? 0 : (cur.total / totalIncome) * 100;
      acc[cur.category] = ratio.toFixed(2);
      return acc;
    }, {});

    const reportTypeId = await _getReportTypeId(
      reportConstants.REPORT_TYPE.INCOME_RATIO_BY_CATEGORY,
    );

    await Report.create({
      userId,
      financialYearId: financialYear.financialYearId,
      reportTypeId,
      value: JSON.stringify(ratioByCategory),
    });
  });
  await Promise.all(tasks);
}

// --- Original getReports function remains unchanged ---

const getReports = async (options) => {
  const {
    userId, reportType, sortBy, sortOrder,
  } = options;

  const queryOptions = {
    where: { userId },
    include: [{
      model: ReportType,
      attributes: ['type', 'unit'],
    }],
  };

  if (reportType) {
    queryOptions.include[0].where = {
      type: { [Op.in]: Array.isArray(reportType) ? reportType : [reportType] },
    };
  }
  const validSortFields = ['value', 'createdAt'];
  if (sortBy && validSortFields.includes(sortBy)) {
    queryOptions.order = [[sortBy, sortOrder]];
  } else {
    queryOptions.order = [['createdAt', 'DESC']];
  }
  const reports = await Report.findAll(queryOptions);
  return reports;
};

module.exports = {
  getReports,

  generateTotalIncomeReport,
  generateTotalExpenseReport,
  generatePrevMonthIncomeChangeReport,
  generatePrevMonthExpenseChangeReport,
  generateExpenseRatioByCategoryReport,
  generateIncomeRatioByCategoryReport,
};
