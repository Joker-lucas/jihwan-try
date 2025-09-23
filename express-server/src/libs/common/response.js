const { getContext } = require('../context');

const successResponse = (res, data, statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        data: data,
    });
};

const errorResponse = (res, message, statusCode = 500, errorCode) => {
    const traceId = getContext('traceId');
    return res.status(statusCode).json({
        success: false,
        error: {
            code: errorCode,
            message: message,
            traceId: traceId,
        },
    });
};

module.exports = {
    successResponse,
    errorResponse,
};