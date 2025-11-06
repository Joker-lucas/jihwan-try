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

module.exports = {
  GENDER,
  USER_STATUS,
  USER_ROLE,
};
