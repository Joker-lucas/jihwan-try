'use strict';
const {
  Model
} = require('sequelize');
const { transactionConstants } = require('../../constants');
module.exports = (sequelize, DataTypes) => {
  class Expense extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Expense.belongsTo(models.User, { foreignKey: 'userId' });
      Expense.belongsTo(models.FinancialYear, { foreignKey: 'financialYearId' });
    }
  }
  Expense.init({
    expenseId: {
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
        transactionConstants.EXPENSE_CATEGORIES.LIVING_EXPENSES,
        transactionConstants.EXPENSE_CATEGORIES.FIXED_EXPENSES,
        transactionConstants.EXPENSE_CATEGORIES.LEISURE,
      ),
      allowNull: false,
    },
    paymentMethod: {
      type: DataTypes.ENUM(
        transactionConstants.PAYMENT_METHODS.BANK_TRANSFER,
        transactionConstants.PAYMENT_METHODS.CASH,
        transactionConstants.PAYMENT_METHODS.CREDIT_CARD,
        transactionConstants.PAYMENT_METHODS.DEBIT_CARD,
      ),
      allowNull: true,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        transactionConstants.TRANSACTION_STATUS.APPROVED,
        transactionConstants.TRANSACTION_STATUS.SCHEDULED,
        transactionConstants.TRANSACTION_STATUS.REJECTED,
      ),
      allowNull: false,
      defaultValue: transactionConstants.TRANSACTION_STATUS.APPROVED,
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
    modelName: 'Expense',
    timestamps: true,
    paranoid: true,
  });
  return Expense;
};