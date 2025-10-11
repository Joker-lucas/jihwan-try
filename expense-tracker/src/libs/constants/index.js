const GENDER = Object.freeze({
  MALE: 'male',
  FEMALE: 'female',
});


const USER_STATUS = Object.freeze({
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  BLOCKED: 'blocked',
});


const USER_ROLE = Object.freeze({
  USER: 'user',
  ADMIN: 'admin',
});


const TRANSACTION_STATUS = Object.freeze({
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED', 
});


const INCOME_CATEGORIES = Object.freeze({
  SALARY: 'SALARY',         // 월급
  SIDE_INCOME: 'SIDE_INCOME', // 부수입
  ALLOWANCE: 'ALLOWANCE',   // 용돈
});

// 지출 카테고리 (Expense, Budget)
const EXPENSE_CATEGORIES = Object.freeze({
  LIVING_EXPENSES: 'LIVING_EXPENSES', // 생활비
  FIXED_EXPENSES: 'FIXED_EXPENSES',   // 고정지출
  LEISURE: 'LEISURE',                 // 여가생활
});


const PAYMENT_METHODS = Object.freeze({
  BANK_TRANSFER: 'BANK_TRANSFER', // 계좌이체
  CASH: 'CASH',                 // 현금
  CREDIT_CARD: 'CREDIT_CARD',     // 신용카드
  DEBIT_CARD: 'DEBIT_CARD',       // 체크카드     
});

const CHECKLIST_STATUS = Object.freeze({
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
});

const USER_LOG_ACTION_TYPE = Object.freeze({
  PROFILE_UPDATE: 'PROFILE_UPDATE',
  ROLE_CHANGE: 'ROLE_CHANGE',

});

const USER_LOG_RESULT = Object.freeze({
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
});


module.exports = {
  GENDER,
  USER_STATUS,
  USER_ROLE,
  TRANSACTION_STATUS,
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
  PAYMENT_METHODS,
  CHECKLIST_STATUS,
  USER_LOG_ACTION_TYPE,
  USER_LOG_RESULT,
};