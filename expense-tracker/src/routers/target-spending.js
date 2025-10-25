const express = require('express');
const router = express.Router();

const { targetSpendingController } = require('../controllers');
const {
  isLogin,
  validateTargetSpendingRequired, 
  validateTargetSpendingData,     
  filterTargetSpendingBody        
} = require('../libs/middlewares');


router.get('/', isLogin, targetSpendingController.getTargetSpendings);

router.get('/:targetSpendingId', isLogin, targetSpendingController.getTargetSpendingById);

router.post('/', isLogin, validateTargetSpendingRequired, validateTargetSpendingData, filterTargetSpendingBody, targetSpendingController.createTargetSpending);

router.patch('/:targetSpendingId',isLogin, validateTargetSpendingData,filterTargetSpendingBody,targetSpendingController.updateTargetSpending);

router.delete('/:targetSpendingId',isLogin, targetSpendingController.deleteTargetSpending);

module.exports = router;