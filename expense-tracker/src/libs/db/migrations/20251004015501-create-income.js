'use strict';

const { TRANSACTION_STATUS, INCOME_CATEGORIES } = require('../../constants');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Incomes', {
      incomeId: {
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
          'SALARY',
          'SIDE_INCOME',
          'ALLOWANCE'
        ),
      },
      amount: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      status: { 
        allowNull: false,
        type: Sequelize.ENUM(
          'APPROVED',
          'SCHEDULED', 
          'REJECTED'
        ),
        defaultValue: 'APPROVED', 
      },
      date: {
        allowNull: false,
        type: Sequelize.DATEONLY
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
    await queryInterface.dropTable('Incomes');
  }
};