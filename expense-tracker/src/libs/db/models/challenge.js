const {
  Model,
} = require('sequelize');
const { challengeConstants } = require('../../constants');

module.exports = (sequelize, DataTypes) => {
  class Challenge extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Challenge.hasMany(models.ChallengeChecklist, { foreignKey: 'challengeId' });
    }
  }
  Challenge.init({
    challengeId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    rewardXp: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    challengeStartDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    challengeExpireDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    challengeType: {
      type: DataTypes.ENUM(
        challengeConstants.CHALLENGE_TYPE.EXPENSE_COUNT_MORE,
        challengeConstants.CHALLENGE_TYPE.EXPENSE_COUNT_LESS,
        challengeConstants.CHALLENGE_TYPE.INCOME_COUNT_MORE,
        challengeConstants.CHALLENGE_TYPE.INCOME_COUNT_LESS,
        challengeConstants.CHALLENGE_TYPE.EXPENSE_TOTAL_AMOUNT_MORE,
        challengeConstants.CHALLENGE_TYPE.EXPENSE_TOTAL_AMOUNT_LESS,
        challengeConstants.CHALLENGE_TYPE.INCOME_TOTAL_AMOUNT_MORE,
        challengeConstants.CHALLENGE_TYPE.INCOME_TOTAL_AMOUNT_LESS,
      ),
      allowNull: true,
    },
    targetValue: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    limitDay: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Challenge',
    timestamps: true,
    paranoid: true,
  });
  return Challenge;
};
