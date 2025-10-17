const express = require('express');
const router = express.Router();

const { incomeController } = require('../controllers');
const {
  isLogin
} = require('../libs/middlewares');

router.get('/', isLogin, incomeController.getAllIncomes);

router.post('/', isLogin,incomeController.createIncome);

router.patch('/:incomoeId',isLogin, incomeController.updateIncome);

router.delete('/:incomoeId', isLogin, incomeController.deleteIncome);

module.exports = router;