'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        nickname: '모든 데이터 입력자',
        email: 'perfect@example.com',
        gender: 'female', 
        birthday: '2000-07-19',
        lastLoginAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      {
        nickname: '필수데이터만 입력',
        email: null, 
        gender: 'male', 
        birthday: null, 
        lastLoginAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },
  async down (queryInterface, Sequelize) {
  }
};