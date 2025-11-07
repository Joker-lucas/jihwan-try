const bcrypt = require('bcrypt');

const { User, BasicCredential, sequelize } = require('../libs/db/models');
const { error, errorDefinition } = require('../libs/common');

const { CustomError } = error;
const { ERROR_CODES } = errorDefinition;

const userLogService = require('./user-log');
const { LOG_CODES } = require('../libs/constants/user-log');

const salt = 10;

const signUp = async (userData, context) => {
  const t = await sequelize.transaction();
  const { nickname } = userData;
  const { gender } = userData;
  const { email } = userData;
  const { birthday } = userData;
  const { password } = userData;
  const hashedPassword = await bcrypt.hash(password, salt);
  try {
    const newUser = await User.create({
      nickname, contactEmail: email, gender, birthday,
    }, { transaction: t });
    await BasicCredential.create({
      loginEmail: email,
      password: hashedPassword,
      userId: newUser.userId,
    }, { transaction: t });

    await t.commit();

    const foundUser = await User.findByPk(newUser.userId, {
      include: [{
        model: BasicCredential,
        attributes: ['loginEmail'],
      }],
    });
    const result = foundUser.toJSON();

    await userLogService.createLog({
      userId: newUser.userId,
      actionType: LOG_CODES.USER_SIGNUP,
      status: 'SUCCESS',
      details: { context, target: { userId: newUser.userId } },
    });

    return result;
  } catch (e) {
    await t.rollback();
    if (e.name === 'SequelizeUniqueConstraintError') {
      throw new CustomError(ERROR_CODES.DUPLICATE_EMAIL);
    }
    throw e;
  }
};

const signIn = async (email, password, context) => {
  const credential = await BasicCredential.findOne({
    where: { loginEmail: email },
    include: [{ model: User }],
  });

  if (!credential) {
    throw new CustomError(ERROR_CODES.USER_NOT_FOUND);
  }

  const passwordCorrect = await bcrypt.compare(password, credential.password);

  if (!passwordCorrect) {
    throw new CustomError(ERROR_CODES.INVALID_PASSWORD);
  }

  const user = credential.User;

  await user.update({ lastLoginAt: new Date() });

  await userLogService.createLog({
    userId: user.userId,
    actionType: LOG_CODES.USER_LOGIN,
    status: 'SUCCESS',
    details: { context, target: { email } },
  });

  return user;
};

const signOut = async () => true;

module.exports = {
  signUp,
  signIn,
  signOut,
};
