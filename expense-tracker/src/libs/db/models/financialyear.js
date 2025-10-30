const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FinancialYear extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      FinancialYear.hasMany(models.Income, { foreignKey: 'financialYearId' });
      FinancialYear.hasMany(models.Expense, { foreignKey: 'financialYearId' });
      FinancialYear.hasMany(models.TargetSpending, { foreignKey: 'financialYearId' });
    }
  }
  FinancialYear.init({
    financialYearId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    month: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'FinancialYear',
    timestamps: true,
    indexes: [{
      unique: true,
      fields: ['year', 'month'],
    }],
  });
  return FinancialYear;
};
