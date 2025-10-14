'use strict';
const { EXPENSE_CATEGORIES } = require('../../constants');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TargetSpendings', {
      targetSpendingId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'userId',
        },
      },
      financialYearId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'FinancialYears',
          key: 'financialYearId',
        },
      },
      category: { 
        allowNull: false,
        type: Sequelize.ENUM(
          'LIVING_EXPENSES',
          'FIXED_EXPENSES',
          'LEISURE'
        ),
      },
      amount: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      description: {
        allowNull: true,
        type: Sequelize.TEXT
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
    await queryInterface.dropTable('TargetSpendings');
  }
};