const bcrypt = require('bcrypt');
const { User, BasicCredential, sequelize } = require('../libs/db/models');
const salt = 10;



const signUp = async (userData) => {
    const t = await sequelize.transaction();
    try {
        //const { nickname, gender, email, birthday, password } = userData;
        const nickname = userData.nickname;
        const gender = userData.gender;
        const email = userData.email;
        const birthday = userData.birthday;
        const password = userData.password;
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({ nickname, contactEmail: email, gender, birthday }, { transaction: t });
        await BasicCredential.create({
            loginEmail: email,
            password: hashedPassword,
            userId: newUser.userId,
        }, { transaction: t });

        await t.commit();

        const foundUser = await User.findByPk(newUser.userId, {
            include: [{
                model: BasicCredential,
                attributes: ['loginEmail']
            }]
        });

        const result = foundUser.toJSON();
        return result;
    } catch (error) {
        await t.rollback();
        throw error;
    }
};

const signIn = async (email, password) => {
    try {
        const credential = await BasicCredential.findOne({
            where: { loginEmail: email },
            include: [{ model: User }]
        });

        if (!credential) {
            return null;
        }

        const passwordCorrect = await bcrypt.compare(password, credential.password);

        if (!passwordCorrect) {
            return null;
        }

        const user = credential.User;
        
        return user;
    } catch (error) {
        throw error;
    }
};


const signOut = async () => {
    return true;
};

module.exports = {
    signUp,
    signIn,
    signOut,
};