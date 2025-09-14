const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const jwtSecret = 'jihwanproject';

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = jwtSecret;

module.exports = (passport, userService) => {
passport.use('jwt', new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        const user = await userService.getUserById(jwt_payload.userId);
        
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (error) {
        return done(error);
    }
}));
}

