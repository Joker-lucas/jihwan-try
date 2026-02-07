const { Op } = require('sequelize');
const { User, BasicCredential, sequelize } = require('../libs/db/models');
const { error, errorDefinition } = require('../libs/common');

const { CustomError } = error;
const { ERROR_CODES } = errorDefinition;

const getAllUsers = async (search, searchBy, page, limit) => {
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

  const offset = (page - 1) * limit;

  const { count, rows } = await User.findAndCountAll({
    where: whereClause,
    limit,
    offset,
    order: [['userId', 'DESC']],
  });

  return {
    totalCount: count,
    users: rows,
  };
};

const getUserById = async (userId) => {
  const foundUser = await User.findByPk(userId, {
    include: [{
      model: BasicCredential,
      attributes: ['loginEmail'],
    }],
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
    await BasicCredential.destroy({ where: { userId }, transaction: t });

    const deletedRowCount = await User.destroy({
      where: { userId },
      transaction: t,
    });

    await t.commit();
    return deletedRowCount;
  } catch (e) {
    await t.rollback();
    throw e;
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
