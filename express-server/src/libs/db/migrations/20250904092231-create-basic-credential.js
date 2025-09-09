'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('BasicCredentials', {
      basicCredentialId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId:{
        allowNull: false,
        unique: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'userId',
        },
        onUpdate: 'RESTRICT', // CASCADE로 하면 기본키 변경 가능성 차단이 어려움.
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING
      },
      
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('BasicCredentials');
  }
};