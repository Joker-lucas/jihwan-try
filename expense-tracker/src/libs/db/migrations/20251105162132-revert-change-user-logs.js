/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('UserLogs', 'status');
    await queryInterface.addColumn('UserLogs', 'status', {
      type: Sequelize.ENUM(
        'SUCCESS',
        'FAILURE',
      ),
      allowNull: false,
      defaultValue: 'SUCCESS',
    });
    await queryInterface.addColumn('UserLogs', 'traceId', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('UserLogs', 'status');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "public"."enum_UserLogs_status";');
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
};
