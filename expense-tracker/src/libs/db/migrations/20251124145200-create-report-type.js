/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ReportTypes', {
      reportTypeId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM(
          'MONTHLY_TOTAL_INCOME',
          'MONTHLY_TOTAL_EXPENSE',
          'PREV_MONTH_EXPENSE_CHANGE',
          'PREV_MONTH_INCOME_CHANGE',
          'EXPENSE_RATIO_BY_CATEGORY',
          'INCOME_RATIO_BY_CATEGORY',
        ),
        allowNull: false,
        unique: true,
      },
      unit: {
        type: Sequelize.ENUM(
          'WON',
          'PERCENT',
          'COUNT',
        ),
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
    await queryInterface.dropTable('ReportTypes');
  },
};
