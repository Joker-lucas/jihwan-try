const passport = require('passport');
const LocalStrategy = require('passport-local');
const {authService} = require('../../services');
const {userService} = require('../../services');


passport.use('local-cookie', new LocalStrategy(
    {usernameField: 'email'},
    async (email, password, done)=>{
        try{
            const user = await authService.signIn(email, password);

            if(!user){
                return done(null, false, {message: '잘못된 사용자'});
            }
            return done(null, user);
        }
        catch (error){
            return done(error);
        }
    }
));

passport.serializeUser((user, done) =>{
    done(null,user.userId);
}) ;

passport.deserializeUser(async (userId, done) =>{
    console.log(`세션 userId: ${userId}`);
    try{
        const user = await userService.getUserById(userId);
        done(null, user);
    }
    catch (error){
        done(error);
    }
});


module.exports = passport;