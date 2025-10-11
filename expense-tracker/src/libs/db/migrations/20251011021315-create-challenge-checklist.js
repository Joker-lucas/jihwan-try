'use strict';
const { CHECKLIST_STATUS } = require('../../constants');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ChallengeChecklists', {
      challengeChecklistId: {
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
      challengeId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Challenges', 
          key: 'challengeId',
        },
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM(
          CHECKLIST_STATUS.PENDING,
          CHECKLIST_STATUS.COMPLETED
        ),
        defaultValue: CHECKLIST_STATUS.PENDING
      },
      achievedAt: {
        allowNull: true,
        type: Sequelize.DATE
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
    await queryInterface.dropTable('ChallengeChecklists');
  }
};