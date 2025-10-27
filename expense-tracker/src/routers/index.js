const express = require('express');

const router = express.Router();

const userRoute = require('./user');
const authRoute = require('./auth');
const incomeRoute = require('./income');
const expenseRoute = require('./expense');
const summaryRoute = require('./summary');
const targetSpendingRoute = require('./target-spending');
const reportRoute = require('./report');
const challengeRoute = require('./challenge');

router.use('/users', userRoute);
router.use('/auth', authRoute);
router.use('/incomes', incomeRoute);
router.use('/expenses', expenseRoute);
router.use('/summary', summaryRoute);
router.use('/target-spendings', targetSpendingRoute);
router.use('/reports', reportRoute);
router.use('/challengs', challengeRoute);

router.use((req, res) => {
  res.status(404).json({ errorMsg: '페이지를 찾을 수 없습니다.' });
});

module.exports = router;
