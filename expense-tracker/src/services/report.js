const { Op } = require('sequelize');
const pLimit = require('p-limit');
const {
  Report, ReportType, Income, Expense, FinancialYear, User,
} = require('../libs/db/models');
const { reportConstants } = require('../libs/constants');
const { error, errorDefinition } = require('../libs/common');

const { CustomError } = error;
const { ERROR_CODES } = errorDefinition;

const _getFinancialYear = async (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const financialYear = await FinancialYear.findOne({
    where: { year, month },
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

const _getMonthlyDateRange = (date) => {
  const targetDate = new Date(date);
  const year = targetDate.getFullYear();
  const month = targetDate.getMonth();
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);

  return { startDate, endDate };
};

const generateTotalIncomeReport = async (date) => {
  const users = await User.findAll({ attributes: ['userId'] });
  const limit = pLimit(process.env.REPORT_JOB_CONCURRENCY);

  const tasks = users.map((user) => limit(async () => {
    const { userId } = user;
    const { startDate, endDate } = _getMonthlyDateRange(date);

    const financialYear = await _getFinancialYear(startDate);
    const whereClause = { userId, date: { [Op.gte]: startDate, [Op.lte]: endDate } };
    const totalIncome = await Income.sum('amount', { where: whereClause });
    const reportTypeId = await _getReportTypeId(reportConstants.REPORT_TYPE.MONTHLY_TOTAL_INCOME);

    await Report.create({
      userId,
      financialYearId: financialYear.financialYearId,
      reportTypeId,
      value: String(totalIncome),
    });
  }));
  await Promise.all(tasks);
};

const generateTotalExpenseReport = async (date) => {
  const users = await User.findAll({ attributes: ['userId'] });
  const limit = pLimit(process.env.REPORT_JOB_CONCURRENCY);

  const tasks = users.map((user) => limit(async () => {
    const { userId } = user;
    const { startDate, endDate } = _getMonthlyDateRange(date);

    const financialYear = await _getFinancialYear(startDate);
    const whereClause = { userId, date: { [Op.gte]: startDate, [Op.lte]: endDate } };
    const totalExpense = await Expense.sum('amount', { where: whereClause });
    const reportTypeId = await _getReportTypeId(reportConstants.REPORT_TYPE.MONTHLY_TOTAL_EXPENSE);

    await Report.create({
      userId,
      financialYearId: financialYear.financialYearId,
      reportTypeId,
      value: String(totalExpense),
    });
  }));
  await Promise.all(tasks);
};

const generatePrevMonthIncomeChangeReport = async (date) => {
  const users = await User.findAll({ attributes: ['userId'] });
  const limit = pLimit(process.env.REPORT_JOB_CONCURRENCY);

  const tasks = users.map((user) => limit(async () => {
    const { userId } = user;
    const { startDate, endDate } = _getMonthlyDateRange(date);
    const prevStartDate = new Date(startDate.getFullYear(), startDate.getMonth() - 1, 1);
    const prevEndDate = new Date(endDate.getFullYear(), endDate.getMonth() - 1, 0);

    const financialYear = await _getFinancialYear(startDate);
    const whereClause = { userId, date: { [Op.gte]: startDate, [Op.lte]: endDate } };
    const prevWhereClause = { userId, date: { [Op.gte]: prevStartDate, [Op.lte]: prevEndDate } };

    const totalIncome = await Income.sum('amount', { where: whereClause });
    const prevTotalIncome = await Income.sum('amount', { where: prevWhereClause });

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
  }));
  await Promise.all(tasks);
};

const generatePrevMonthExpenseChangeReport = async (date) => {
  const users = await User.findAll({ attributes: ['userId'] });
  const limit = pLimit(process.env.REPORT_JOB_CONCURRENCY);

  const tasks = users.map((user) => limit(async () => {
    const { userId } = user;
    const { startDate, endDate } = _getMonthlyDateRange(date);
    const prevStartDate = new Date(startDate.getFullYear(), startDate.getMonth() - 1, 1);
    const prevEndDate = new Date(endDate.getFullYear(), endDate.getMonth() - 1, 0);

    const financialYear = await _getFinancialYear(startDate);
    const whereClause = { userId, date: { [Op.gte]: startDate, [Op.lte]: endDate } };
    const prevWhereClause = { userId, date: { [Op.gte]: prevStartDate, [Op.lte]: prevEndDate } };

    const totalExpense = await Expense.sum('amount', { where: whereClause });
    const prevTotalExpense = await Expense.sum('amount', { where: prevWhereClause });

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
  }));
  await Promise.all(tasks);
};

const generateExpenseRatioByCategoryReport = async (date) => {
  const users = await User.findAll({ attributes: ['userId'] });
  const limit = pLimit(process.env.REPORT_JOB_CONCURRENCY);

  const tasks = users.map((user) => limit(async () => {
    const { userId } = user;
    const { startDate, endDate } = _getMonthlyDateRange(date);

    const financialYear = await _getFinancialYear(startDate);
    const whereClause = { userId, date: { [Op.gte]: startDate, [Op.lte]: endDate } };

    const totalExpense = await Expense.sum('amount', { where: whereClause });
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
  }));
  await Promise.all(tasks);
};

const generateIncomeRatioByCategoryReport = async (date) => {
  const users = await User.findAll({ attributes: ['userId'] });
  const limit = pLimit(process.env.REPORT_JOB_CONCURRENCY);

  const tasks = users.map((user) => limit(async () => {
    const { userId } = user;
    const { startDate, endDate } = _getMonthlyDateRange(date);

    const financialYear = await _getFinancialYear(startDate);
    const whereClause = { userId, date: { [Op.gte]: startDate, [Op.lte]: endDate } };

    const totalIncome = await Income.sum('amount', { where: whereClause });
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
  }));
  await Promise.all(tasks);
};

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
