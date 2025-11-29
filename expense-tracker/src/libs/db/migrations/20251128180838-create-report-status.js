/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ReportStatuses', {
      reportStatusId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      reportTypeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'ReportTypes',
          key: 'reportTypeId',
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
      status: {
        type: Sequelize.ENUM('COMPLETED', 'FAILED', 'INPROGRESS'),
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
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('ReportStatuses');
  },
};
