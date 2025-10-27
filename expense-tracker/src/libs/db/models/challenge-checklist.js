const {
  Model,
} = require('sequelize');

const { challengeConstants } = require('../../constants');

module.exports = (sequelize, DataTypes) => {
  class ChallengeChecklist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ChallengeChecklist.belongsTo(models.User, { foreignKey: 'userId' });
      ChallengeChecklist.belongsTo(models.Challenge, { foreignKey: 'challengeId' });
      ChallengeChecklist.hasMany(models.ChallengePeriod, { foreignKey: 'challengePeriodId' });
    }
  }
  ChallengeChecklist.init({
    challengeChecklistId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    challengeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        challengeConstants.CHECKLIST_STATUS.PENDING,
        challengeConstants.CHECKLIST_STATUS.COMPLETED,
      ),
      allowNull: false,
      defaultValue: challengeConstants.CHECKLIST_STATUS.PENDING,
    },
    achievedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'ChallengeChecklist',
    timestamps: true,
    paranoid: true,
  });
  return ChallengeChecklist;
};
