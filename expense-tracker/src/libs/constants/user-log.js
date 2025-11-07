const USER_LOG_RESULT = Object.freeze({
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
});

const LOG_CODES = Object.freeze({
  USER_SIGNUP: 'USER_SIGNUP',
  USER_LOGIN: 'USER_LOGIN',
  USER_LOGOUT: 'USER_LOGOUT',

  CREATE_EXPENSE: 'CREATE_EXPENSE',
  UPDATE_EXPENSE: 'UPDATE_EXPENSE',
  DELETE_EXPENSE: 'DELETE_EXPENSE',

  GET_EXPENSE_LIST: 'GET_EXPENSE_LIST',
  GET_EXPENSE_DETAIL: 'GET_EXPENSE_DETAIL',

  CREATE_INCOME: 'CREATE_INCOME',
  UPDATE_INCOME: 'UPDATE_INCOME',
  DELETE_INCOME: 'DELETE_INCOME',

  GET_INCOME_LIST: 'GET_INCOME_LIST',
  GET_INCOME_DETAIL: 'GET_INCOME_DETAIL',

  CREATE_CHALLENGE: 'CREATE_CHALLENGE',
  UPDATE_CHALLENGE: 'UPDATE_CHALLENGE',
  DELETE_CHALLENGE: 'DELETE_CHALLENGE',
  UPDATE_CHALLENGE_STATUS: 'UPDATE_CHALLENGE_STATUS',

  GET_CHALLENGE_LIST: 'GET_CHALLENGE_LIST',
  GET_CHALLENGE_DETAIL: 'GET_CHALLENGE_DETAIL',

  GET_CHALLENGE_CHECKLIST_LIST: 'GET_CHALLENGE_CHECKLIST_LIST',
  GET_CHALLENGE_CHECKLIST_DETAIL: 'GET_CHALLENGE_CHECKLIST_DETAIL',

  CREATE_CHALLENGE_CHECKLIST: 'CREATE_CHALLENGE_CHECKLIST',

  GET_USER_LIST: 'GET_USER_LIST',
  GET_USER_DETAIL: 'GET_USER_DETAIL',
  UPDATE_USER: 'UPDATE_USER',
  DELETE_USER: 'DELETE_USER',
});

const LOG_INFO = {
  [LOG_CODES.USER_SIGNUP]: {
    [USER_LOG_RESULT.SUCCESS]: (details) => `[${details.context.method} ${details.context.url}] 새로운 사용자가 가입했습니다. (Target ID: ${details.target.userId})`,
    [USER_LOG_RESULT.FAILURE]: (details) => `[${details.context.method} ${details.context.url}] 회원가입 시도 실패. (Target Email: ${details.target.email}, 사유: ${details.error.message})`,
  },
  [LOG_CODES.USER_LOGIN]: {
    [USER_LOG_RESULT.SUCCESS]: (details) => `[${details.context.method} ${details.context.url}] 사용자가 시스템에 로그인했습니다. (Target ID: ${details.target.userId})`,
    [USER_LOG_RESULT.FAILURE]: (details) => `[${details.context.method} ${details.context.url}] 로그인 시도 실패. (Attempted Email: ${details.target.email}, 사유: ${details.error.message})`,
  },
  [LOG_CODES.USER_LOGOUT]: {
    [USER_LOG_RESULT.SUCCESS]: (details) => `[${details.context.method} ${details.context.url}] 사용자가 로그아웃했습니다. (Target ID: ${details.target.userId})`,
    [USER_LOG_RESULT.FAILURE]: (details) => `[${details.context.method} ${details.context.url}] 로그아웃 실패. (Target ID: ${details.target.userId}, 사유: ${details.error.message})`,
  },
  [LOG_CODES.GET_USER_LIST]: {
    [USER_LOG_RESULT.SUCCESS]: (details) => `[${details.context.method} ${details.context.url}] 사용자 목록을 조회했습니다.`,
    [USER_LOG_RESULT.FAILURE]: (details) => `[${details.context.method} ${details.context.url}] 사용자 목록 조회에 실패했습니다. (사유: ${details.error.message})`,
  },
  [LOG_CODES.GET_USER_DETAIL]: {
    [USER_LOG_RESULT.SUCCESS]: (details) => `[${details.context.method} ${details.context.url}] 사용자 상세 정보를 조회했습니다. (Target ID: ${details.target.userId})`,
    [USER_LOG_RESULT.FAILURE]: (details) => `[${details.context.method} ${details.context.url}] 사용자 상세 정보 조회에 실패했습니다. (Target ID: ${details.target.userId}, 사유: ${details.error.message})`,
  },
  [LOG_CODES.UPDATE_USER]: {
    [USER_LOG_RESULT.SUCCESS]: (details) => `[${details.context.method} ${details.context.url}] 사용자 정보를 수정했습니다. (Target ID: ${details.target.userId})`,
    [USER_LOG_RESULT.FAILURE]: (details) => `[${details.context.method} ${details.context.url}] 사용자 정보 수정에 실패했습니다. (Target ID: ${details.target.userId}, 사유: ${details.error.message})`,
  },
  [LOG_CODES.DELETE_USER]: {
    [USER_LOG_RESULT.SUCCESS]: (details) => `[${details.context.method} ${details.context.url}] 사용자를 삭제했습니다. (Target ID: ${details.target.userId})`,
    [USER_LOG_RESULT.FAILURE]: (details) => `[${details.context.method} ${details.context.url}] 사용자 삭제에 실패했습니다. (Target ID: ${details.target.userId}, 사유: ${details.error.message})`,
  },

  [LOG_CODES.CREATE_EXPENSE]: {
    [USER_LOG_RESULT.SUCCESS]: (details) => `[${details.context.method} ${details.context.url}] 새로운 지출 내역을 등록했습니다. (금액: ${details.body.amount}원, 카테고리: ${details.body.category})`,
    [USER_LOG_RESULT.FAILURE]: (details) => `[${details.context.method} ${details.context.url}] 지출 내역 등록 실패. (사유: ${details.error.message})`,
  },
  [LOG_CODES.UPDATE_EXPENSE]: {
    [USER_LOG_RESULT.SUCCESS]: (details) => `[${details.context.method} ${details.context.url}] 지출 내역을 수정했습니다. (Target ID: ${details.target.expenseId}, 금액: ${details.body.amount}원)`,
    [USER_LOG_RESULT.FAILURE]: (details) => `[${details.context.method} ${details.context.url}] 지출 내역 수정 실패. (Target ID: ${details.target.expenseId}, 사유: ${details.error.message})`,
  },
  [LOG_CODES.DELETE_EXPENSE]: {
    [USER_LOG_RESULT.SUCCESS]: (details) => `[${details.context.method} ${details.context.url}] 지출 내역을 삭제했습니다. (Target ID: ${details.target.expenseId})`,
    [USER_LOG_RESULT.FAILURE]: (details) => `[${details.context.method} ${details.context.url}] 지출 내역 삭제 실패. (Target ID: ${details.target.expenseId}, 사유: ${details.error.message})`,
  },
  [LOG_CODES.GET_EXPENSE_LIST]: {
    [USER_LOG_RESULT.SUCCESS]: (details) => `[${details.context.method} ${details.context.url}] 지출 내역 목록을 조회했습니다.`,
    [USER_LOG_RESULT.FAILURE]: (details) => `[${details.context.method} ${details.context.url}] 지출 내역 목록 조회 실패. (사유: ${details.error.message})`,
  },
  [LOG_CODES.GET_EXPENSE_DETAIL]: {
    [USER_LOG_RESULT.SUCCESS]: (details) => `[${details.context.method} ${details.context.url}] 지출 상세 내역을 조회했습니다. (Target ID: ${details.target.expenseId})`,
    [USER_LOG_RESULT.FAILURE]: (details) => `[${details.context.method} ${details.context.url}] 지출 상세 내역 조회 실패. (Target ID: ${details.target.expenseId}, 사유: ${details.error.message})`,
  },

  [LOG_CODES.CREATE_INCOME]: {
    [USER_LOG_RESULT.SUCCESS]: (details) => `[${details.context.method} ${details.context.url}] 새로운 수입 내역을 등록했습니다. (금액: ${details.body.amount}원)`,
    [USER_LOG_RESULT.FAILURE]: (details) => `[${details.context.method} ${details.context.url}] 수입 내역 등록 실패. (사유: ${details.error.message})`,
  },
  [LOG_CODES.UPDATE_INCOME]: {
    [USER_LOG_RESULT.SUCCESS]: (details) => `[${details.context.method} ${details.context.url}] 수입 내역을 수정했습니다. (Target ID: ${details.target.incomeId}, 금액: ${details.body.amount}원)`,
    [USER_LOG_RESULT.FAILURE]: (details) => `[${details.context.method} ${details.context.url}] 수입 내역 수정 실패. (Target ID: ${details.target.incomeId}, 사유: ${details.error.message})`,
  },
  [LOG_CODES.DELETE_INCOME]: {
    [USER_LOG_RESULT.SUCCESS]: (details) => `[${details.context.method} ${details.context.url}] 수입 내역을 삭제했습니다. (Target ID: ${details.target.incomeId})`,
    [USER_LOG_RESULT.FAILURE]: (details) => `[${details.context.method} ${details.context.url}] 수입 내역 삭제 실패. (Target ID: ${details.target.incomeId}, 사유: ${details.error.message})`,
  },
  [LOG_CODES.GET_INCOME_LIST]: {
    [USER_LOG_RESULT.SUCCESS]: (details) => `[${details.context.method} ${details.context.url}] 수입 내역 목록을 조회했습니다.`,
    [USER_LOG_RESULT.FAILURE]: (details) => `[${details.context.method} ${details.context.url}] 수입 내역 목록 조회 실패. (사유: ${details.error.message})`,
  },
  [LOG_CODES.GET_INCOME_DETAIL]: {
    [USER_LOG_RESULT.SUCCESS]: (details) => `[${details.context.method} ${details.context.url}] 수입 상세 내역을 조회했습니다. (Target ID: ${details.target.incomeId})`,
    [USER_LOG_RESULT.FAILURE]: (details) => `[${details.context.method} ${details.context.url}] 수입 상세 내역 조회 실패. (Target ID: ${details.target.incomeId}, 사유: ${details.error.message})`,
  },

  [LOG_CODES.CREATE_CHALLENGE]: {
    [USER_LOG_RESULT.SUCCESS]: (details) => `[${details.context.method} ${details.context.url}] 새로운 챌린지를 생성했습니다. (챌린지명: ${details.body.title})`,
    [USER_LOG_RESULT.FAILURE]: (details) => `[${details.context.method} ${details.context.url}] 챌린지 생성 실패. (사유: ${details.error.message})`,
  },
  [LOG_CODES.UPDATE_CHALLENGE]: {
    [USER_LOG_RESULT.SUCCESS]: (details) => `[${details.context.method} ${details.context.url}] 챌린지를 수정했습니다. (Target ID: ${details.target.challengeId})`,
    [USER_LOG_RESULT.FAILURE]: (details) => `[${details.context.method} ${details.context.url}] 챌린지 수정 실패. (Target ID: ${details.target.challengeId}, 사유: ${details.error.message})`,
  },
  [LOG_CODES.DELETE_CHALLENGE]: {
    [USER_LOG_RESULT.SUCCESS]: (details) => `[${details.context.method} ${details.context.url}] 챌린지를 삭제했습니다. (Target ID: ${details.target.challengeId})`,
    [USER_LOG_RESULT.FAILURE]: (details) => `[${details.context.method} ${details.context.url}] 챌린지 삭제 실패. (Target ID: ${details.target.challengeId}, 사유: ${details.error.message})`,
  },
  [LOG_CODES.UPDATE_CHALLENGE_STATUS]: {
    [USER_LOG_RESULT.SUCCESS]: (details) => `[${details.context.method} ${details.context.url}] 챌린지 상태를 변경했습니다. (Target ID: ${details.target.challengeChecklistId}, 상태: ${details.body.status})`,
    [USER_LOG_RESULT.FAILURE]: (details) => `[${details.context.method} ${details.context.url}] 챌린지 상태 변경 실패. (Target ID: ${details.target.challengeChecklistId}, 사유: ${details.error.message})`,
  },
  [LOG_CODES.GET_CHALLENGE_LIST]: {
    [USER_LOG_RESULT.SUCCESS]: (details) => `[${details.context.method} ${details.context.url}] 챌린지 목록을 조회했습니다.`,
    [USER_LOG_RESULT.FAILURE]: (details) => `[${details.context.method} ${details.context.url}] 챌린지 목록 조회에 실패했습니다. (사유: ${details.error.message})`,
  },
  [LOG_CODES.GET_CHALLENGE_DETAIL]: {
    [USER_LOG_RESULT.SUCCESS]: (details) => `[${details.context.method} ${details.context.url}] 챌린지 상세 정보를 조회했습니다. (Target ID: ${details.target.challengeId})`,
    [USER_LOG_RESULT.FAILURE]: (details) => `[${details.context.method} ${details.context.url}] 챌린지 상세 정보 조회에 실패했습니다. (Target ID: ${details.target.challengeId}, 사유: ${details.error.message})`,
  },

  [LOG_CODES.GET_CHALLENGE_CHECKLIST_LIST]: {
    [USER_LOG_RESULT.SUCCESS]: (details) => `[${details.context.method} ${details.context.url}] 챌린지 체크리스트 목록을 조회했습니다.`,
    [USER_LOG_RESULT.FAILURE]: (details) => `[${details.context.method} ${details.context.url}] 챌린지 체크리스트 목록 조회에 실패했습니다. (사유: ${details.error.message})`,
  },
  [LOG_CODES.GET_CHALLENGE_CHECKLIST_DETAIL]: {
    [USER_LOG_RESULT.SUCCESS]: (details) => `[${details.context.method} ${details.context.url}] 챌린지 체크리스트 상세 정보를 조회했습니다. (Target ID: ${details.target.challengeChecklistId})`,
    [USER_LOG_RESULT.FAILURE]: (details) => `[${details.context.method} ${details.context.url}] 챌린지 체크리스트 상세 정보 조회에 실패했습니다. (Target ID: ${details.target.challengeChecklistId}, 사유: ${details.error.message})`,
  },
  [LOG_CODES.CREATE_CHALLENGE_CHECKLIST]: {
    [USER_LOG_RESULT.SUCCESS]: (details) => `[${details.context.method} ${details.context.url}] 챌린지에 참여했습니다. (Target ID: ${details.target.challengeId})`,
    [USER_LOG_RESULT.FAILURE]: (details) => `[${details.context.method} ${details.context.url}] 챌린지 참여에 실패했습니다. (Target ID: ${details.target.challengeId}, 사유: ${details.error.message})`,
  },
};

module.exports = {
  USER_LOG_RESULT,
  LOG_CODES,
  LOG_INFO,
};
