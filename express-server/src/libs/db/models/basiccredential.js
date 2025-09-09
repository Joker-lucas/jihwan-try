'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BasicCredential extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      BasicCredential.belongsTo(models.User, {foreignKey: 'userId'});
    };
  }
  BasicCredential.init({
    basicCredentialId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    loginEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: { 
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    }
  }, {
    sequelize,
    modelName: 'BasicCredential',
    timestamps: true,
  });
  return BasicCredential;
};