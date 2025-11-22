const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Report extends Model {
    static associate(models) {
      Report.belongsTo(models.User, { foreignKey: 'userId' });
      Report.belongsTo(models.FinancialYear, { foreignKey: 'financialYearId' });
      Report.belongsTo(models.ReportType, { foreignKey: 'reportTypeId' });
    }
  }

  Report.init({
    reportId: {
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
    reportTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Report',
    timestamps: true,
    paranoid: true,
  });

  return Report;
};
