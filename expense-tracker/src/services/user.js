const { User, BasicCredential, sequelize } = require('../libs/db/models');
const { Op } = require('sequelize');
const { error, errorDefinition } = require('../libs/common');
const { CustomError } = error;
const { ERROR_CODES } = errorDefinition;

const getAllUsers = async (search, searchBy) => {
    const whereClause = {};


    if (search) {
    const allowedFields = ['nickname', 'contactEmail'];

    if (searchBy && !allowedFields.includes(searchBy)) {
      throw new CustomError(ERROR_CODES.INVALID_INPUT);
    }

    if (searchBy === 'contactEmail') {
      whereClause.contactEmail = { [Op.like]: `%${search}%` };
    } else if (searchBy === 'nickname') {
      whereClause.nickname = { [Op.like]: `%${search}%` };
    }
  }

    const allUsers = await User.findAll({
        where: whereClause
    });

    return allUsers;
};

const getUserById = async (userId) => {
    const foundUser = await User.findByPk(userId, {
        include: [{
            model: BasicCredential,
            attributes: ['loginEmail']
        }]
    });
    if (!foundUser) {
        throw new CustomError(ERROR_CODES.USER_NOT_FOUND);
    }
    return foundUser;
};

const updateUserById = async (userId, updateData) => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new CustomError(ERROR_CODES.USER_NOT_FOUND);
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
    updateUserById,
    deleteUserById,
};