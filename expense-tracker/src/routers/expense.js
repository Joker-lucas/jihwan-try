const express = require('express');
const router = express.Router();

const { expenseController } = require('../controllers');
const {
  isLogin
} = require('../libs/middlewares');

router.get('/', isLogin, expenseController.getAllExpenses);

router.post('/', isLogin,expenseController.createExpense);

router.patch('/:expenseId',isLogin, expenseController.updateExpense);

router.delete('/:expenseId', isLogin, expenseController.deleteExpense);

module.exports = router;