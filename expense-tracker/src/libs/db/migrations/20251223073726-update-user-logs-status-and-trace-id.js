/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      'ALTER TYPE "public"."enum_UserLogs_status" ADD VALUE IF NOT EXISTS \'SUCCESS\';',
    );
    await queryInterface.sequelize.query(
      'ALTER TYPE "public"."enum_UserLogs_status" ADD VALUE IF NOT EXISTS \'FAILURE\';',
    );

    const tableDescription = await queryInterface.describeTable('UserLogs');

    if (!tableDescription.traceId) {
      await queryInterface.addColumn('UserLogs', 'traceId', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    await queryInterface.changeColumn('UserLogs', 'status', {
      type: Sequelize.ENUM('APPROVE', 'REJECTED', 'SUCCESS', 'FAILURE'),
      allowNull: false,
      defaultValue: 'SUCCESS',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('UserLogs', 'status', {
      type: Sequelize.ENUM('APPROVE', 'REJECTED'),
      allowNull: false,
    });

    const tableDescription = await queryInterface.describeTable('UserLogs');
    if (tableDescription.traceId) {
      await queryInterface.removeColumn('UserLogs', 'traceId');
    }
  },
};
