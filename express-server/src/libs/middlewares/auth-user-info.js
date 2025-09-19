  const { setContext } = require('./context');

  const addUserToContext = (req, res, next) => {
    if (req.user) {
    setContext('user', { 
      userId: req.user.userId,
      nickname: req.user.nickname,
      email: req.user.contactEmail,
    });
  }
  next();
};

  module.exports = 
  { 
    addUserToContext,
  }