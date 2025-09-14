const LocalStrategy = require('passport-local');


module.exports = (passport, authService) => {
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
    console.log("세션에 유저 정보를 저장함.")
    done(null,user);
}) ;

passport.deserializeUser(async (user, done) =>{
    console.log(user);
    try{
        done(null, user);
    }
    catch (error){
        done(error);
    }
});
}