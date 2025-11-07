/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Challenges', 'challengeStartDate', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });
    await queryInterface.addColumn('Challenges', 'challengeEndDate', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });
    await queryInterface.addColumn('Challenges', 'limitTime', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn('ChallengeChecklists', 'userStartDate', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });
    await queryInterface.addColumn('ChallengeChecklists', 'userEndDate', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });
    await queryInterface.renameColumn('ChallengeChecklists', 'achievedAt', 'completeDate');
    await queryInterface.changeColumn('ChallengeChecklists', 'status', {
      type: Sequelize.ENUM('PENDING', 'COMPLETED', 'FAILED'),
      allowNull: false,
      defaultValue: 'PENDING',
    });

    await queryInterface.dropTable('ChallengePeriods');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Challenges', 'limitTime');
    await queryInterface.removeColumn('Challenges', 'challengeEndDate');
    await queryInterface.removeColumn('Challenges', 'challengeStartDate');

    await queryInterface.removeColumn('ChallengeChecklists', 'userEndDate');
    await queryInterface.removeColumn('ChallengeChecklists', 'userStartDate');
    await queryInterface.renameColumn('ChallengeChecklists', 'completeDate', 'achievedAt');
    await queryInterface.changeColumn('ChallengeChecklists', 'status', {
      type: Sequelize.ENUM('PENDING', 'COMPLETED'),
      allowNull: false,
      defaultValue: 'PENDING',
    });

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
};
