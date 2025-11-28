const userController = require('./user');
const authController = require('./auth');
const incomeController = require('./income');
const expenseController = require('./expense');
const summaryController = require('./summary');
const targetSpendingController = require('./target-spending');
const reportController = require('./report');
const challengeController = require('./challenge');
const challengeChecklistController = require('./challenge-checklist');
const userLogController = require('./user-log');
const weatherController = require('./weather');

module.exports = {
  userController,
  authController,
  incomeController,
  expenseController,
  summaryController,
  targetSpendingController,
  reportController,
  challengeController,
  challengeChecklistController,
  userLogController,
  weatherController,
};
