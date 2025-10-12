'use strict';
const { TRANSACTION_STATUS, EXPENSE_CATEGORIES, PAYMENT_METHODS } = require('../../constants');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Expenses', {
      expenseId: {
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
      paymentMethod: {
        allowNull: true,
        type: Sequelize.ENUM(
          'BANK_TRANSFER',
          'CASH',
          'CREDIT_CARD',
          'DEBIT_CARD'
        ),
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
    await queryInterface.dropTable('Expenses');
  }
};