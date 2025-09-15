
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { User } = require('../../libs/db/models');
const jwtSecret = 'jihwanproject';

const _localGetUserById = async (jwt_payload) => {
    try {
        const user = await User.findByPk(jwt_payload.userId);
        return user;
    } catch (error) {
        throw error;
    }
};

const init = (passport) => {
  const opts = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret,
  };

  passport.use('jwt', new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
          const user = await _localGetUserById(jwt_payload);
          if (user) {
              return done(null, user);
          } else {
              return done(null, false);
          }
      } catch (error) {
          return done(error);
      }
  }));
};


module.exports = {
  init,
};

