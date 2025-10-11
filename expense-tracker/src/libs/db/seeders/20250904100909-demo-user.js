'use strict';
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const salt = 10;
const { User, BasicCredential, FinancialYear, Income, Expense, Budget, Challenge, ChallengePeriod, ChallengeChecklist, UserLog } = require('../models');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

   try {
      const hashPasswordAdmin1 = await bcrypt.hash('admin123', salt);
      const hashPasswordAdmin2 = await bcrypt.hash('admin456', salt);
      const hashPasswordAdmin3 = await bcrypt.hash('admin789', salt);
      const hashPasswordUser = await bcrypt.hash('user123', salt);

      const admin1 = await User.create({
        nickname: '관리자1',
        contactEmail: 'admin1@example.com',
        gender: constants.GENDER.FEMALE,
        status: constants.USER_STATUS.ACTIVE,
        role: constants.USER_ROLE.ADMIN,
        permissionLevel: 1
      }, { transaction });
      await BasicCredential.create({
        loginEmail: 'admin1@example.com',
        password: hashPasswordAdmin1, 
        userId: admin1.userId,
      }, { transaction });


      const admin2 = await User.create({
        nickname: '관리자2',
        contactEmail: 'admin2@example.com',
        gender: constants.GENDER.MALE,
        status: constants.USER_STATUS.ACTIVE,
        role: constants.USER_ROLE.ADMIN,
        permissionLevel: 1
      }, { transaction });
      await BasicCredential.create({
        loginEmail: 'admin2@example.com',
        password: hashPasswordAdmin2,
        userId: admin2.userId,
      }, { transaction });

      const admin3 = await User.create({
        nickname: '관리자3',
        contactEmail: 'admin3@example.com',
        gender: constants.GENDER.FEMALE,
        status: constants.USER_STATUS.ACTIVE,
        role: constants.USER_ROLE.ADMIN,
        permissionLevel: 2
      }, { transaction });
      await BasicCredential.create({
        loginEmail: 'admin3@example.com',
        password: hashPasswordAdmin3, 
        userId: admin3.userId,
      }, { transaction });

      const user = await User.create({
        nickname: '가계부사용자',
        contactEmail: 'user@example.com',
        gender: constants.GENDER.MALE,
        status: constants.USER_STATUS.ACTIVE,
        role: constants.USER_ROLE.USER,
        permissionLevel: 0
      }, { transaction });
      await BasicCredential.create({
        loginEmail: 'user@example.com',
        password: hashPasswordUser,
        userId: user.userId,
      }, { transaction });


      let august2025;
      const foundFinancialYear = await FinancialYear.findOne({ where: { year: 2025, month: 8 }, transaction });
      if (foundFinancialYear) {
        august2025 = foundFinancialYear;
      } else {
        august2025 = await FinancialYear.create({ year: 2025, month: 8, }, { transaction });
      }

      await Income.create({ userId: user.userId, financialYearId: august2025.financialYearId, category: constants.INCOME_CATEGORIES.ALLOWANCE, amount: 50000, status: constants.TRANSACTION_STATUS.APPROVED, date: '2025-08-03' }, { transaction });
      await Income.create({ userId: user.userId, financialYearId: august2025.financialYearId, category: constants.INCOME_CATEGORIES.SIDE_INCOME, amount: 16000, status: constants.TRANSACTION_STATUS.APPROVED, date: '2025-08-04' }, { transaction });
      await Income.create({ userId: user.userId, financialYearId: august2025.financialYearId, category: constants.INCOME_CATEGORIES.SALARY, amount: 3000000, status: constants.TRANSACTION_STATUS.APPROVED, date: '2025-08-10' }, { transaction });

      await Expense.create({ userId: user.userId, financialYearId: august2025.financialYearId, category: constants.EXPENSE_CATEGORIES.LIVING_EXPENSES, paymentMethod: constants.PAYMENT_METHODS.CASH, amount: 8000, status: constants.TRANSACTION_STATUS.APPROVED, date: '2025-08-03' }, { transaction });
      await Expense.create({ userId: user.userId, financialYearId: august2025.financialYearId, category: constants.EXPENSE_CATEGORIES.FIXED_EXPENSES, paymentMethod: constants.PAYMENT_METHODS.BANK_TRANSFER, amount: 16000, status: constants.TRANSACTION_STATUS.APPROVED, date: '2025-08-04' }, { transaction });
      await Expense.create({ userId: user.userId, financialYearId: august2025.financialYearId, category: constants.EXPENSE_CATEGORIES.LEISURE, paymentMethod: constants.PAYMENT_METHODS.CREDIT_CARD, amount: 600000, status: constants.TRANSACTION_STATUS.APPROVED, date: '2025-08-11' }, { transaction });
      await Expense.create({ userId: user.userId, financialYearId: august2025.financialYearId, category: constants.EXPENSE_CATEGORIES.LEISURE, paymentMethod: constants.PAYMENT_METHODS.CREDIT_CARD, amount: 2000000, status: constants.TRANSACTION_STATUS.REJECTED, date: '2025-08-18' }, { transaction });

      await Budget.create({ userId: user.userId, financialYearId: august2025.financialYearId, category: constants.EXPENSE_CATEGORIES.LIVING_EXPENSES, amount: 600000 }, { transaction });
      await Budget.create({ userId: user.userId, financialYearId: august2025.financialYearId, category: constants.EXPENSE_CATEGORIES.FIXED_EXPENSES, amount: 1500000 }, { transaction });
      await Budget.create({ userId: user.userId, financialYearId: august2025.financialYearId, category: constants.EXPENSE_CATEGORIES.LEISURE, amount: 300000 }, { transaction });

      const challenge1 = await Challenge.create({ title: '시작이 반이다', description: '수입 작성을 3번 이상 해라.', reward: '10EXP' }, { transaction });
      const challenge2 = await Challenge.create({ title: '꼼꼼한 기록가', description: '상세내용을 포함한 지출 내역을 10회 기록해라.', reward: '50EXP' }, { transaction });

      await UserLog.create({ userId: admin1.userId, actionType: constants.USER_LOG_ACTION_TYPE.PROFILE_UPDATE, result: constants.USER_LOG_RESULT.SUCCESS, details: '사용자 프로필 정보 업데이트 성공' }, { transaction });
      await UserLog.create({ userId: admin2.userId, actionType: constants.USER_LOG_ACTION_TYPE.ROLE_CHANGE, result: constants.USER_LOG_RESULT.SUCCESS, details: '사용자 권한 변경 성공' }, { transaction });
      await UserLog.create({ userId: admin3.userId, actionType: constants.USER_LOG_ACTION_TYPE.ROLE_CHANGE, result: constants.USER_LOG_RESULT.FAILURE, details: '다른 사용자의 권한 변경 시도 거부됨' }, { transaction });



      await transaction.commit();

      
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down (queryInterface, Sequelize) {
  }
};