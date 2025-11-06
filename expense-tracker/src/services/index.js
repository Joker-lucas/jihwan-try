const userService = require('./user');
const authService = require('./auth');
const incomeService = require('./income');
const targetSpendingService = require('./target-spending');
const expenseService = require('./expense');
const userLogService = require('./user-log');

module.exports = {
  userService,
  authService,
  incomeService,
  targetSpendingService,
  expenseService,
  userLogService,
};
