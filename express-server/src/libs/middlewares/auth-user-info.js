const { asyncLocalStorage } = require('./context');

const addUserToContext = (req, res, next) => {
  if (req.user) {
    const store = asyncLocalStorage.getStore();
    if (store) {
      store.set('user', { 
        userId: req.user.userId,
        nickname: req.user.nickname,
        email: req.user.contactEmail,
      });
    }
  }
  next();
};

module.exports = 
{ 
  addUserToContext,
}