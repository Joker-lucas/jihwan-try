'use strict';
const {
  Model,
} = require('sequelize');
const { userConstants } = require('../../constants');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasOne(models.BasicCredential, {foreignKey: 'userId'});

      User.hasMany(models.TargetSpending, { foreignKey: 'userId' });
      User.hasMany(models.Income, { foreignKey: 'userId' }); 
      User.hasMany(models.Expense, { foreignKey: 'userId' });
      User.hasMany(models.ChallengeChecklist, { foreignKey: 'userId' });
      User.hasMany(models.UserLog, { foreignKey: 'userId' }); 
    }
  }
  User.init({
     userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    nickname: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    profileImageUrl: {
      type: DataTypes.STRING,
      allowNull: true,       
    },
    contactEmail: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    gender: {
      type: DataTypes.ENUM(
        userConstants.GENDER.MALE, 
        userConstants.GENDER.FEMALE
      ),
      allowNull: false,
      defaultValue: userConstants.GENDER.MALE,

    },
    birthday: {
      allowNull: true,
      type: DataTypes.DATEONLY,
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(
        userConstants.USER_STATUS.ACTIVE, 
        userConstants.USER_STATUS.BLOCKED, 
        userConstants.USER_STATUS.INACTIVE
      ),
      allowNull: false,
      defaultValue: userConstants.USER_STATUS.ACTIVE,
    },
    role: {
      type: DataTypes.ENUM(
        userConstants.USER_ROLE.ADMIN,
         userConstants.USER_ROLE.USER
        ),
      allowNull: false,
      defaultValue: userConstants.USER_ROLE.USER,
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1 
    },
    exp: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0 
    }
  }, {
    sequelize,
    modelName: 'User',
    timestamps: true,
    paranoid: true,
  });
  return User;
};