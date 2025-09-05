const { User } = require('../libs/db/models');


const getAllUsers = async () => {
    const allUsers = await User.findAll();
    return allUsers;
};

const getUserById = async (userId) => {
    const foundUser = await User.findByPk(userId);
    return foundUser;
};


const createUser = async (userData) => {
    const newUser = await User.create(userData);
    return newUser;
};

const updateUserById = async (userId, updateData) => {
    const updateResult = await User.update(updateData, {
        where: { id: userId }
    });

    const updatedRowCount = updateResult[0];

    if (updatedRowCount === 0) {
        return null;
    }

    const updatedUser = await getUserById(userId);
    return updatedUser;
};

const deleteUserById = async (userId) => {
    const deletedRowCount = await User.destroy({
        where: { id: userId }
    });

    return deletedRowCount;
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUserById,
    deleteUserById,
};