'use strict';
const {
  Model
} = require('sequelize');
const { EXPENSE_CATEGORIES } = require('../../constants');
module.exports = (sequelize, DataTypes) => {
  class Budget extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Budget.belongsTo(models.User, { foreignKey: 'userId' });
      Budget.belongsTo(models.FinancialYear, { foreignKey: 'financialYearId' });
    }
  }
  Budget.init({
    budgetId: {
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
        EXPENSE_CATEGORIES.LIVING_EXPENSES,
        EXPENSE_CATEGORIES.FIXED_EXPENSES,
        EXPENSE_CATEGORIES.LEISURE
      ),
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Budget',
    timestamps: true,
    paranoid: true,
  });
  return Budget;
};