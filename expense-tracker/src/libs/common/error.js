class CustomError extends Error {
  constructor(errorCode, message) {
    super(message);
    this.errorCode = errorCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  CustomError,
};
