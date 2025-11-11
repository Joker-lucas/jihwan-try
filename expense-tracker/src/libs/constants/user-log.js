const USER_LOG_RESULT = Object.freeze({
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
});

const LOG_CODES = Object.freeze({
  // --- 인증 ---
  USER_SIGNUP: 'USER_SIGNUP',
  USER_LOGIN: 'USER_LOGIN',
  USER_LOGOUT: 'USER_LOGOUT',

  // --- 사용자 관리 ---
  UPDATE_USER: 'UPDATE_USER',
  DELETE_USER: 'DELETE_USER',

  // --- 챌린지 관리 (관리자) ---
  CREATE_CHALLENGE: 'CREATE_CHALLENGE',
  UPDATE_CHALLENGE: 'UPDATE_CHALLENGE',
});

const LOG_INFO = {
  // --- 인증 ---
  [LOG_CODES.USER_SIGNUP]: {
    [USER_LOG_RESULT.SUCCESS]: (details) => `새로운 사용자(${details.target.email})가 가입했습니다.`,
  },
  [LOG_CODES.USER_LOGIN]: {
    [USER_LOG_RESULT.SUCCESS]: (details) => `사용자(${details.target.email})가 로그인했습니다.`,
    [USER_LOG_RESULT.FAILURE]: (details) => `사용자(${details.target.email})의 로그인 시도가 실패했습니다. (사유: ${details.error})`,
  },
  [LOG_CODES.USER_LOGOUT]: {
    [USER_LOG_RESULT.SUCCESS]: (details) => `사용자(${details.target.email})가 로그아웃했습니다.`,
  },

  // --- 사용자 관리 ---
  [LOG_CODES.UPDATE_USER]: {
    [USER_LOG_RESULT.SUCCESS]: (details) => `관리자(${details.actor.email})가 사용자(${details.target.email})의 정보를 수정했습니다.`,
    [USER_LOG_RESULT.FAILURE]: (details) => `관리자(${details.actor.email})의 사용자(${details.target.email}) 정보 수정에 실패했습니다. (사유: ${details.error})`,
  },
  [LOG_CODES.DELETE_USER]: {
    [USER_LOG_RESULT.SUCCESS]: (details) => `관리자(${details.actor.email})가 사용자(${details.target.email})를 삭제했습니다.`,
    [USER_LOG_RESULT.FAILURE]: (details) => `관리자(${details.actor.email})의 사용자(${details.target.email}) 삭제에 실패했습니다. (사유: ${details.error})`,
  },

  // --- 챌린지 관리 (관리자) ---
  [LOG_CODES.CREATE_CHALLENGE]: {
    [USER_LOG_RESULT.SUCCESS]: (details) => `관리자(${details.actor.email})가 새로운 챌린지(${details.body.title})를 생성했습니다.`,
    [USER_LOG_RESULT.FAILURE]: (details) => `관리자(${details.actor.email})의 챌린지 생성에 실패했습니다. (사유: ${details.error})`,
  },
  [LOG_CODES.UPDATE_CHALLENGE]: {
    [USER_LOG_RESULT.SUCCESS]: (details) => `관리자(${details.actor.email})가 챌린지(ID: ${details.target.challengeId})를 수정했습니다.`,
    [USER_LOG_RESULT.FAILURE]: (details) => `관리자(${details.actor.email})의 챌린지(ID: ${details.target.challengeId}) 수정에 실패했습니다. (사유: ${details.error})`,
  },
};

module.exports = {
  USER_LOG_RESULT,
  LOG_CODES,
  LOG_INFO,
};
