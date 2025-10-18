const express = require('express');
const router = express.Router();

const { targetSpendingController } = require('../controllers');
const {
  isLogin
} = require('../libs/middlewares');


router.get('/', isLogin, targetSpendingController.getAllTargetSpendings);

router.post('/', isLogin, targetSpendingController.createTargetSpending);

router.patch('/:targetSpendingId',isLogin, targetSpendingController.updateTargetSpending);

router.delete('/:targetSpendingId',isLogin, targetSpendingController.deleteTargetSpending);

module.exports = router;