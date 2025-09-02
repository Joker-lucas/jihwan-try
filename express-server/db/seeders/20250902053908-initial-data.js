'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Customers', [
      {
        name: '김지환',
        email: 'zxczxc@naver.com',
        password: 'password111',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '김지환1',
        email: 'zxxxxx@naver.com',
        password: 'password222',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],);

    await queryInterface.bulkInsert('Products', [
      {
        name: '노트북',
        description: '갤럭시북',
        price: 1300000,
        stock: 10, 
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '마우스',
        description: '매직 마우스',
        price: 50000,
        stock: 50,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '키보드',
        description: '매직 키보드',
        price: 120000,
        stock: 30,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '노트북',
        description: '맥북',
        price: 1300000,
        stock: 15,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], );
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('Products', null, {});
    await queryInterface.bulkDelete('Customers', null, {});
  }
};
