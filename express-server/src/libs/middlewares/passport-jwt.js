const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { User } = require('../../libs/db/models');
const jwtSecret = 'jihwanproject';

const localGetUserById = async (jwt_payload) => {
    try {
        const user = await User.findByPk(jwt_payload.userId);
        return user;
    } catch (error) {
        throw error;
    }
};


const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = jwtSecret;

passport.use('jwt', new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        const user = await localGetUserById(jwt_payload);
        
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (error) {
        return done(error);
    }
}));

