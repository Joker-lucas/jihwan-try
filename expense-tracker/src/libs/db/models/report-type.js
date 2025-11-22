const { Model } = require('sequelize');
const { reportConstants } = require('../../constants');

module.exports = (sequelize, DataTypes) => {
  class ReportType extends Model {
    static associate(models) {
      ReportType.hasMany(models.Report, { foreignKey: 'reportTypeId' });
    }
  }

  ReportType.init({
    reportTypeId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(
        reportConstants.REPORT_TYPE.MONTHLY_TOTAL_INCOME,
        reportConstants.REPORT_TYPE.MONTHLY_TOTAL_EXPENSE,
        reportConstants.REPORT_TYPE.PREV_MONTH_EXPENSE_CHANGE,
        reportConstants.REPORT_TYPE.PREV_MONTH_INCOME_CHANGE,
        reportConstants.REPORT_TYPE.EXPENSE_RATIO_BY_CATEGORY,
        reportConstants.REPORT_TYPE.INCOME_RATIO_BY_CATEGORY,
      ),
      allowNull: false,
      unique: true,
    },
    unit: {
      type: DataTypes.ENUM(
        reportConstants.REPORT_UNIT.WON,
        reportConstants.REPORT_UNIT.PERCENT,
        reportConstants.REPORT_UNIT.COUNT,
      ),
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'ReportType',
    timestamps: true,
    paranoid: true,
  });

  return ReportType;
};
