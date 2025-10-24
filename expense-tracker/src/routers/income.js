const express = require('express');
const router = express.Router();

const { incomeController } = require('../controllers');
const {
  isLogin,
  validateIncomeRequired,
  validateAmount,
  filterIncomeBody
} = require('../libs/middlewares');

router.get('/', isLogin, incomeController.getIncomes);

router.get('/:incomeId', isLogin, incomeController.getIncomeById);

router.post('/', isLogin,validateIncomeRequired,validateAmount,filterIncomeBody,incomeController.createIncome);

router.patch('/:incomeId',isLogin,validateAmount,filterIncomeBody,incomeController.updateIncome);

router.delete('/:incomeId', isLogin, incomeController.deleteIncome);

module.exports = router;