const successResponse = (res, data, statusCode = 200) => res.status(statusCode).json({
  data,
});

const errorResponse = (res, message, errorCode, statusCode = 500) => res.status(statusCode).json({
  error: {
    code: errorCode,
    message,
  },
});

module.exports = {
  successResponse,
  errorResponse,
};
