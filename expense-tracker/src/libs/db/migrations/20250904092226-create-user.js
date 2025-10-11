'use strict';
const { GENDER, USER_STATUS, USER_ROLE } = require('../../constants');
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
        type: Sequelize.ENUM(GENDER.MALE, GENDER.FEMALE),
        defaultValue: GENDER.MALE,
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
        type: Sequelize.ENUM(USER_STATUS.ACTIVE, USER_STATUS.INACTIVE, USER_STATUS.BLOCKED),
        defaultValue: USER_STATUS.ACTIVE,
      },
      role: {
        allowNull: false,
        type: Sequelize.ENUM(USER_ROLE.USER, USER_ROLE.ADMIN),
        defaultValue: USER_ROLE.USER,
      },
      permissionLevel: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      level: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      exp: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0
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
  }
};