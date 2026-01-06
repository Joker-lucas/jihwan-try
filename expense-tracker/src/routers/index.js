const express = require('express');

const router = express.Router();

const userRoute = require('./user');
const authRoute = require('./auth');
const incomeRoute = require('./income');
const expenseRoute = require('./expense');
const targetSpendingRoute = require('./target-spending');
const reportRoute = require('./report');
const challengeRoute = require('./challenge');
const challengeChecklistRoute = require('./challenge-checklist');
const userLogRoute = require('./user-log');
const weatherRoute = require('./weather');
const healthRoute = require('./health');

router.use('/users', userRoute);
router.use('/auth', authRoute);
router.use('/incomes', incomeRoute);
router.use('/expenses', expenseRoute);
router.use('/target-spendings', targetSpendingRoute);
router.use('/reports', reportRoute);
router.use('/challenges', challengeRoute);
router.use('/challenge-checklists', challengeChecklistRoute);
router.use('/user-logs', userLogRoute);
router.use('/weather', weatherRoute);
router.use('/healthcheck', healthRoute);

router.use((req, res) => {
  res.status(404).json({ errorMsg: '페이지를 찾을 수 없습니다.' });
});

module.exports = router;
