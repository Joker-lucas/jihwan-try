const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ChallengePeriod extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ChallengePeriod.belongsTo(models.ChallengeChecklist, { foreignKey: 'challengeChecklistId' });
    }
  }
  ChallengePeriod.init({
    challengePeriodId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    challengeChecklistId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    financialYearId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'ChallengePeriod',
    timestamps: true,
    paranoid: true,
  });
  return ChallengePeriod;
};
