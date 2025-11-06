/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('UserLogs', 'status', {
      type: Sequelize.ENUM(
        'APPROVE',
        'REJECTED',
      ),
      allowNull: false,
      defaultValue: 'APPROVE',
    });

    await queryInterface.removeColumn('UserLogs', 'traceId');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('UserLogs', 'status');

    await queryInterface.addColumn('UserLogs', 'traceId', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
