'use strict';
const bcrypt = require('bcrypt');
const salt = 10;
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {


    const hashPassword1 = await bcrypt.hash('password123', salt);
    const hashPassword2 = await bcrypt.hash('password456', salt);


    await queryInterface.bulkInsert('Users', [
      {
        id: 1,
        nickname: '모든 데이터 입력자',
        email: 'perfect@example.com',
        gender: 'female', 
        birthday: '2000-07-19',
        lastLoginAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      {
        id: 2,
        nickname: '필수데이터만 입력',
        email: null, 
        gender: 'male', 
        birthday: null, 
        lastLoginAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);

    await queryInterface.bulkInsert('BasicCredentials',[
      {
        username: 'perfect',
        password: hashPassword1,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      {
        username: 'scarce',
        password: hashPassword2,
        userId: 2, 
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  
  async down (queryInterface, Sequelize) {
  }
};