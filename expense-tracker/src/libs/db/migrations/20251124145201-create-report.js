/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reports', {
      reportId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'userId',
        },
      },
      financialYearId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'FinancialYears',
          key: 'financialYearId',
        },
      },
      reportTypeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'ReportTypes',
          key: 'reportTypeId',
        },
      },
      value: {
        type: Sequelize.STRING,
        allowNull: false,
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
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Reports');
  },
};
