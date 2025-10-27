/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserLogs', {
      userLogId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'userId',
        },
      },
      traceId: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      actionType: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      details: {
        allowNull: true,
        type: Sequelize.JSON,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('UserLogs');
  },
};
