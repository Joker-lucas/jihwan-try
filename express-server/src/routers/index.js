const express = require('express');
const router = express.Router();

const userRoute = require('./user');
const authRoute = require('./auth');

router.use('/users', userRoute);
router.use('/auth', authRoute);

router.use( (req, res) => {
    res.status(404).json({ errorMsg: '페이지를 찾을 수 없습니다.' });
});

module.exports = router;