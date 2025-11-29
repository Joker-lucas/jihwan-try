const {
  Model,
} = require('sequelize');
const { reportConstants } = require('../../constants');

module.exports = (sequelize, DataTypes) => {
  class ReportStatus extends Model {
    static associate(models) {
      ReportStatus.belongsTo(models.ReportType, { foreignKey: 'reportTypeId' });
      ReportStatus.belongsTo(models.FinancialYear, { foreignKey: 'financialYearId' });
    }
  }
  ReportStatus.init({
    reportStatusId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    reportTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    financialYearId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        reportConstants.REPORT_STATUS.COMPLETED,
        reportConstants.REPORT_STATUS.FAILED,
        reportConstants.REPORT_STATUS.INPROGRESS,
      ),
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'ReportStatus',
    timestamps: true,
    paranoid: true,
  });
  return ReportStatus;
};
