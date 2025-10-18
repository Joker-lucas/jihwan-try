'use strict';
const {
  Model
} = require('sequelize');
const { transactionConstants } = require('../../constants');
module.exports = (sequelize, DataTypes) => {
  class TargetSpending extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TargetSpending.belongsTo(models.User, { foreignKey: 'userId' });
      TargetSpending.belongsTo(models.FinancialYear, { foreignKey: 'financialYearId' });
    }
  }
  TargetSpending.init({
    targetSpendingId: {
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
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
    
  },
  
   {
    sequelize,
    modelName: 'TargetSpending',
    timestamps: true,
    paranoid: true,
  });
  return TargetSpending;
};