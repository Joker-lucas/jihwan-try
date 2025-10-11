'use strict';
const {
  Model,
} = require('sequelize');
const { GENDER, USER_STATUS, USER_ROLE } = require('../../constants');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasOne(models.BasicCredential, {foreignKey: 'userId'});
      User.hasMany(models.Budget, { foreignKey: 'userId' });
      User.hasMany(models.Income, { foreignKey: 'userId' }); 
      User.hasMany(models.Expense, { foreignKey: 'userId' });
      User.hasMany(models.UserChallengeChecklist, { foreignKey: 'userId' });
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
    contactEmail: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    gender: {
      type: DataTypes.ENUM(GENDER.MALE, GENDER.FEMALE),
      allowNull: false,
      defaultValue: GENDER.MALE,
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
      type: DataTypes.ENUM(USER_STATUS.ACTIVE, USER_STATUS.INACTIVE, USER_STATUS.BLOCKED),
      allowNull: false,
      defaultValue: USER_STATUS.ACTIVE,
    },
    role: {
      type: DataTypes.ENUM(USER_ROLE.USER, USER_ROLE.ADMIN),
      allowNull: false,
      defaultValue: USER_ROLE.USER,
    },
    permissionLevel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0, // 일반 유저는 0, 관리자는 1 이상의 값을 가짐
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