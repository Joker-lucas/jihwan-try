/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ChallengePeriods', {
      challengePeriodId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      challengeChecklistId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'ChallengeChecklists',
          key: 'challengeChecklistId',
        },
      },
      financialYearId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'FinancialYears',
          key: 'financialYearId',
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('ChallengePeriods');
  },
};
