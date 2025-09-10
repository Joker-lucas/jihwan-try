const bcrypt = require('bcrypt');
const { User, BasicCredential, sequelize } = require('../libs/db/models');
const jwt = require('jsonwebtoken');

const salt = 10;
const jwtSecret = 'jihwanproject';


const signUp = async (userData) => {
    const t = await sequelize.transaction();
    try {
        const { nickname, gender, email, birthday, password } = userData;
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
            throw new Error('사용자를 찾을 수 없습니다.');
        }

        const passwordCorrect = await bcrypt.compare(password, credential.password);

        if (!passwordCorrect) {
            throw new Error('비밀번호가 일치하지 않습니다.');
        }

        const user = credential.User;
        const payload = { userId: user.userId };
        const token = jwt.sign(payload, jwtSecret);
        
        return { user, token };
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