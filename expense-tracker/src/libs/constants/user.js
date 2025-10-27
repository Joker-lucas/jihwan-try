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
  USER_LOG_ACTION_TYPE,
  USER_LOG_RESULT,
};
