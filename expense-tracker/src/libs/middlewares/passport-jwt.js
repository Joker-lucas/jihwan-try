const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { User } = require('../db/models');

const jwtSecret = 'jihwanproject';

const _localGetUserById = async (jwtPayload) => {
  const user = await User.findByPk(jwtPayload.userId);
  return user;
};

const init = (passport) => {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret,
  };

  passport.use('jwt', new JwtStrategy(opts, async (jwtPayload, done) => {
    try {
      const user = await _localGetUserById(jwtPayload);
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      return done(error);
    }
  }));
};

module.exports = {
  init,
};
