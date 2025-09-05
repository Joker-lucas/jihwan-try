'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasOne(models.BasicCredential, {foreignKey: 'userId'});
    }
  }
  User.init({

    nickname: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, 
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true, 
    },
    gender: {
      type: DataTypes.ENUM('male', 'female'),
      allowNull: false,
      defaultValue: 'male',
    },
    birthday: {
      allowNull: true,
      type: DataTypes.DATEONLY,
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};