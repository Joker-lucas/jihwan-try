/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'Challenges',
      'challengeType',
      {
        type: Sequelize.ENUM(
          'EXPENSE_COUNT_MORE',
          'EXPENSE_COUNT_LESS',
          'INCOME_COUNT_MORE',
          'INCOME_COUNT_LESS',
          'EXPENSE_TOTAL_AMOUNT_MORE',
          'EXPENSE_TOTAL_AMOUNT_LESS',
          'INCOME_TOTAL_AMOUNT_MORE',
          'INCOME_TOTAL_AMOUNT_LESS',
        ),
        allowNull: true,
      },
    );

    await queryInterface.addColumn(
      'Challenges',
      'targetValue',
      {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
    );
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Challenges', 'targetValue');
    await queryInterface.removeColumn('Challenges', 'challengeType');
  },
};
