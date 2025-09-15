const isLogin = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(403).json({ message: '로그인이 필요합니다.' });
    }
};
module.exports = {
    isLogin
}