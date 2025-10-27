const express = require('express');

const router = express.Router();

const { expenseController } = require('../controllers');
const {
  isLogin,
  validateExpenseRequired,
  validateAmount,
  filterExpenseBody,
} = require('../libs/middlewares');

router.get('/', isLogin, expenseController.getExpenses);

router.get('/:expenseId', isLogin, expenseController.getExpenseById);

router.post('/', isLogin, validateExpenseRequired, validateAmount, filterExpenseBody, expenseController.createExpense);

router.patch('/:expenseId', isLogin, validateAmount, filterExpenseBody, expenseController.updateExpense);

router.delete('/:expenseId', isLogin, expenseController.deleteExpense);

module.exports = router;
