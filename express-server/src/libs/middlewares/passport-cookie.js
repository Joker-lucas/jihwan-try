const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const { User, BasicCredential } = require('../../libs/db/models');

const localSignIn = async (email, password) => {
    try {
        const credential = await BasicCredential.findOne({
            where: { loginEmail: email },
            include: [{ model: User }]
        });
        if (!credential) { return null; }

        const passwordCorrect = await bcrypt.compare(password, credential.password);
        if (!passwordCorrect) { return null; }

        return credential.User;
    } catch (error) {
        throw error;
    }
};


passport.use('local-cookie', new LocalStrategy(
    {usernameField: 'email'},
    async (email, password, done)=>{
        try{
            const user = await localSignIn(email, password);
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
