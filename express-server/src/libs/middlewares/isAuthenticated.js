const isNotLogin = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(403).json({ message: '로그인이 필요합니다.' });
    }
};

const  isLogin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        res.status(401).json({ message: '이미 로그인한 상태입니다.' });
    }
};

module.exports = {
    isLogin,
    isNotLogin
}