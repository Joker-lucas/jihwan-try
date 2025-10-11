'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserLog.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  UserLog.init({
    userLogId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    traceId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    actionType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    details: {
      type: DataTypes.JSON,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'UserLog',
    timestamps: true,
    updatedAt: false,
    paranoid: false,
  });
  return UserLog;
};