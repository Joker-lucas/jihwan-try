const { reportService } = require('../services');
const { JOB_TYPES } = require('../libs/constants/job-queue');
const { logger } = require('../libs/logger');

const CRON_SCHEDULE = '0 0 1 * *';

const reportJobs = {
  [JOB_TYPES.GENERATE_TOTAL_INCOME_REPORT]: {
    repeat: { cron: CRON_SCHEDULE },
    func: async () => {
      logger.info('START - GENERATE_TOTAL_INCOME_REPORT.');
      await reportService.generateTotalIncomeReport(new Date());
      logger.info('END - GENERATE_TOTAL_INCOME_REPORT');
      return { status: 'success' };
    },
  },
  [JOB_TYPES.GENERATE_TOTAL_EXPENSE_REPORT]: {
    repeat: { cron: CRON_SCHEDULE },
    func: async () => {
      logger.info('START - GENERATE_TOTAL_EXPENSE_REPORT');
      await reportService.generateTotalExpenseReport(new Date());
      logger.info('END - GENERATE_TOTAL_EXPENSE_REPORT.');
      return { status: 'success' };
    },
  },
  [JOB_TYPES.GENERATE_PREV_MONTH_INCOME_CHANGE_REPORT]: {
    repeat: { cron: CRON_SCHEDULE },
    func: async () => {
      logger.info('START - GENERATE_PREV_MONTH_INCOME_CHANGE_REPORT');
      await reportService.generatePrevMonthIncomeChangeReport(new Date());
      logger.info('END - GENERATE_PREV_MONTH_INCOME_CHANGE_REPORT');
      return { status: 'success' };
    },
  },
  [JOB_TYPES.GENERATE_PREV_MONTH_EXPENSE_CHANGE_REPORT]: {
    repeat: { cron: CRON_SCHEDULE },
    func: async () => {
      logger.info('START - GENERATE_PREV_MONTH_EXPENSE_CHANGE_REPORT');
      await reportService.generatePrevMonthExpenseChangeReport(new Date());
      logger.info('END - GENERATE_PREV_MONTH_EXPENSE_CHANGE_REPORT.');
      return { status: 'success' };
    },
  },
  [JOB_TYPES.GENERATE_EXPENSE_RATIO_BY_CATEGORY_REPORT]: {
    repeat: { cron: CRON_SCHEDULE },
    func: async () => {
      logger.info('START - GENERATE_EXPENSE_RATIO_BY_CATEGORY_REPORT');
      await reportService.generateExpenseRatioByCategoryReport(new Date());
      logger.info('END - GENERATE_EXPENSE_RATIO_BY_CATEGORY_REPORT');
      return { status: 'success' };
    },
  },
  [JOB_TYPES.GENERATE_INCOME_RATIO_BY_CATEGORY_REPORT]: {
    repeat: { cron: CRON_SCHEDULE },
    func: async () => {
      logger.info('START - GENERATE_INCOME_RATIO_BY_CATEGORY_REPORT');
      await reportService.generateIncomeRatioByCategoryReport(new Date());
      logger.info('END - GENERATE_INCOME_RATIO_BY_CATEGORY_REPORT');
      return { status: 'success' };
    },
  },
};

module.exports = reportJobs;
