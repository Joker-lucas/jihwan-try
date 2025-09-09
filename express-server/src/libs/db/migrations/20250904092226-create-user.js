'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      userId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nickname: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },
      contactEmail: {
        allowNull: true,
        unique: true,
        type: Sequelize.STRING
      },
      gender: {
        allowNull: false,
        type: Sequelize.ENUM('male', 'female'),
        defaultValue: 'male'
      },
      birthday: {
        allowNull: true,
        type: Sequelize.DATEONLY,
      },
      lastLoginAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
    
      status: {
        allowNull: false,
        type: Sequelize.ENUM('active', 'inactive', 'blocked'),
        defaultValue: 'active'
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
      },
      
      deletedAt: {
        allowNull: true, 
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
    await queryInterface.sequelize.query(`
    DROP TYPE "public"."enum_Users_status";
  `);
  }
};