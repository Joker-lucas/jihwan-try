'use strict';
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const salt = 10;
const { User, BasicCredential } = require('../models');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

   try {
      const hashPassword1 = await bcrypt.hash('password123', salt);
      const hashPassword2 = await bcrypt.hash('password456', salt);

      const user1 = await User.create({
        nickname: '모든 데이터 입력자',
        email: 'perfect@example.com',
        gender: 'female',
        birthday: '2000-07-19',
        status: 'active',
      }, { transaction });
      await BasicCredential.create({
        username: 'perfect',
        password: hashPassword1,
        userId: user1.userId,
      }, { transaction });

      const user2 = await User.create({
        nickname: '필수데이터만 입력',
        email: 'zxcxzczxc@naver.com',
        gender: 'male',
        status: 'active',
      }, { transaction });

      await BasicCredential.create({
        password: hashPassword2,
        userId: user2.userId,
      }, { transaction });

      await transaction.commit();

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down (queryInterface, Sequelize) {
  }
};