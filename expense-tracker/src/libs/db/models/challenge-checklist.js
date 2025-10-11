'use strict';
const {
  Model
} = require('sequelize');

const { CHECKLIST_STATUS } = require('../../constants');
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
        CHECKLIST_STATUS.PENDING,
        CHECKLIST_STATUS.COMPLETED
      ),
      allowNull: false,
      defaultValue: CHECKLIST_STATUS.PENDING,
    },
    achievedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'ChallengeChecklist',
    timestamps: true,
    paranoid: true,
  });
  return ChallengeChecklist;
};
