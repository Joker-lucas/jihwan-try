const {
  Model,
} = require('sequelize');

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
    challengeEndDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    limitTime: {
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
