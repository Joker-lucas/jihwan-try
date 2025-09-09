const bcrypt = require('bcrypt');
const { User, BasicCredential, sequelize } = require('../libs/db/models');


const getAllUsers = async () => {
    const allUsers = await User.findAll();
    return allUsers;
};

const getUserById = async (userId) => {
    const foundUser = await User.findByPk(userId);
    return foundUser;
};


const createUser = async (userData) => {

    const t = await sequelize.transaction();

    try {
        const { nickname, gender, email, birthday, password } = userData;
        const specialCharacters = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        if (!nickname || nickname.length < 2 || nickname.length > 15) {
            const error = new Error('닉네임은 2자 이상, 15자 이하로 입력해주세요.');
            error.status = 400;
            throw error;
        }
        if (specialCharacters.test(nickname)) {
            const error = new Error('닉네임에 특수문자를 사용할 수 없습니다.');
            error.status = 400;
            throw error;
        }
        if (!password || password.length < 6) {
            const error = new Error('비밀번호는 6자 이상이어야 합니다.');
            error.status = 400;
            throw error;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

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
    }

    catch (error) {
        await t.rollback();
        throw error;
    }
};



const updateUserById = async (userId, updateData) => {
    const user = await User.findByPk(userId);

    if (!user) {
        return null;
    }
    const updatedUser = await user.update(updateData);

    return updatedUser;
};

const deleteUserById = async (userId) => {

    const t = await sequelize.transaction();

    try {
        await BasicCredential.destroy({ where: { userId: userId }, transaction: t });

        const deletedRowCount = await User.destroy({
            where: { userId: userId },
            transaction: t
        });

        await t.commit();
        return deletedRowCount;

    } catch (error) {
        await t.rollback();
        throw error;
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUserById,
    deleteUserById,
};