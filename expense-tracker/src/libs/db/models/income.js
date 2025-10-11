'use strict';
const {
  Model
} = require('sequelize');
const { TRANSACTION_STATUS, INCOME_CATEGORIES } = require('../../constants');
module.exports = (sequelize, DataTypes) => {
  class Income extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Income.belongsTo(models.User, { foreignKey: 'userId' });
      Income.belongsTo(models.FinancialYear, { foreignKey: 'financialYearId' });
    }
  }
  Income.init({
    incomeId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    financialYearId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM(
        INCOME_CATEGORIES.SALARY,
        INCOME_CATEGORIES.SIDE_INCOME,
        INCOME_CATEGORIES.ALLOWANCE
      ),
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        TRANSACTION_STATUS.APPROVED,
        TRANSACTION_STATUS.REJECTED
      ),
      allowNull: false,
      defaultValue: TRANSACTION_STATUS.REJECTED,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'Income',
    timestamps: true,
    paranoid: true,
  });
  return Income;
};