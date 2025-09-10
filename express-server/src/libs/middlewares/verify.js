const jwt = require('jsonwebtoken');
const { User } = require('../db/models');
const jwtSecret = 'jihwanproject';

const verifyToken = async(req, res, next) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: '인증 토큰이 필요합니다.' });
    }

    try {
        
        const decoded = jwt.verify(token, jwtSecret);

        const user = await User.findByPk(decoded.userId);

        if (!user) {
            return res.status(404).json({ errorMsg: '찾을 수 없는 사용자입니다.' });
        }
    
        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({ errorMsg: '유효하지 않은 토큰입니다.' });
    }
};
module.exports = {
    verifyToken
};