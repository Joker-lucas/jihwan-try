const { setContext } = require('../context');

const addUserContext = (req, res, next) => {
  if (req.user) {
    const userData = {
      userId: req.user.userId,
      nickname: req.user.nickname,
    };
    setContext('user', userData);
  }
  next();
};

module.exports = {
  addUserContext,
};