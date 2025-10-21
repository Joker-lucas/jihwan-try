const express = require('express');
const router = express.Router();

const { incomeController } = require('../controllers');
const {
  isLogin,
  validateIncomeRequired,
  validateIncomeData,
  filterIncomeBody
} = require('../libs/middlewares');

router.get('/', isLogin, incomeController.getAllIncomes);

router.post('/', isLogin,validateIncomeRequired,validateIncomeData,filterIncomeBody,incomeController.createIncome);

router.patch('/:incomeId',isLogin,validateIncomeData,filterIncomeBody,incomeController.updateIncome);

router.delete('/:incomeId', isLogin, incomeController.deleteIncome);

module.exports = router;