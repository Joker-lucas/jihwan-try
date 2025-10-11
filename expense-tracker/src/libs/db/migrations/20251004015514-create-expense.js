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
          EXPENSE_CATEGORIES.LIVING_EXPENSES,
          EXPENSE_CATEGORIES.FIXED_EXPENSES,
          EXPENSE_CATEGORIES.LEISURE
        ),
      },
      amount: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      paymentMethod: {
        allowNull: true,
        type: Sequelize.ENUM(
          PAYMENT_METHODS.BANK_TRANSFER,
          PAYMENT_METHODS.CASH,
          PAYMENT_METHODS.CREDIT_CARD,
          PAYMENT_METHODS.DEBIT_CARD
        ),
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM(
          TRANSACTION_STATUS.APPROVED,
          TRANSACTION_STATUS.REJECTED
        ),
        defaultValue: TRANSACTION_STATUS.REJECTED,
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