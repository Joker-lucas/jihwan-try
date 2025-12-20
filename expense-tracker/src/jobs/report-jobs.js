const { reportService } = require('../services');
const { JOB_TYPES } = require('../libs/constants/job-queue');
const { reportConstants } = require('../libs/constants');
const { logger } = require('../libs/logger');
const { ReportStatus, FinancialYear, ReportType } = require('../libs/db/models');

const _getFinancialYear = async (date) => {
  const targetDate = new Date(date);
  const year = targetDate.getFullYear();
  const month = targetDate.getMonth() + 1;

  const financialYear = await FinancialYear.findOne({ where: { year, month } });
  if (!financialYear) {
    throw new Error(`FinancialYear not found for ${year}-${month}`);
  }
  return financialYear;
};

const _getReportTypeIdByName = async (name) => {
  const reportType = await ReportType.findOne({ where: { type: name } });
  if (!reportType) {
    throw new Error(`ReportType not found for name: ${name}`);
  }
  return reportType.reportTypeId;
};

const reportGenerationTasks = [
  {
    name: reportConstants.REPORT_TYPE.MONTHLY_TOTAL_INCOME,
    func: reportService.generateTotalIncomeReport,
  },
  {
    name: reportConstants.REPORT_TYPE.MONTHLY_TOTAL_EXPENSE,
    func: reportService.generateTotalExpenseReport,
  },
  {
    name: reportConstants.REPORT_TYPE.PREV_MONTH_INCOME_CHANGE,
    func: reportService.generatePrevMonthIncomeChangeReport,
  },
  {
    name: reportConstants.REPORT_TYPE.PREV_MONTH_EXPENSE_CHANGE,
    func: reportService.generatePrevMonthExpenseChangeReport,
  },
  {
    name: reportConstants.REPORT_TYPE.EXPENSE_RATIO_BY_CATEGORY,
    func: reportService.generateExpenseRatioByCategoryReport,
  },
  {
    name: reportConstants.REPORT_TYPE.INCOME_RATIO_BY_CATEGORY,
    func: reportService.generateIncomeRatioByCategoryReport,
  },
];

const reportJobs = {
  [JOB_TYPES.GENERATE_MONTHLY_REPORTS]: {
    repeat: { cron: '0 0 0 1 * *' },
    func: async () => {
      logger.info('START - GENERATE_MONTHLY_REPORTS');
      const reportDate = new Date();
      const financialYear = await _getFinancialYear(reportDate);
      for (const task of reportGenerationTasks) {
        const reportTypeId = await _getReportTypeIdByName(task.name);
        const where = { reportTypeId, financialYearId: financialYear.financialYearId };
        const status = await ReportStatus.findOne({ where });

        if (status?.status === reportConstants.REPORT_STATUS.COMPLETED) {
          logger.info(`Skipping task ${task.name} - already completed.`);
          continue;
        }

        try {
          await ReportStatus.upsert(
            { ...where, status: reportConstants.REPORT_STATUS.INPROGRESS },
          );
          logger.info(`START - ${task.name}`);

          await task.func(reportDate);

          await ReportStatus.upsert(
            { ...where, status: reportConstants.REPORT_STATUS.COMPLETED },
          );
          logger.info(`END - ${task.name}`);
        } catch (error) {
          logger.error(`FAILED - ${task.name}: ${error.message}`);
          await ReportStatus.upsert(
            {
              ...where,
              status: reportConstants.REPORT_STATUS.FAILED,
            },
          );
          break;
        }
      }

      logger.info('END - GENERATE_MONTHLY_REPORTS');
      return { status: 'success' };
    },
  },
};

module.exports = reportJobs;
