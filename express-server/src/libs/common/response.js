const successResponse = (res, data, statusCode = 200) => {
    return res.status(statusCode).json({
        data: data,
    });
};

const errorResponse = (res, message, statusCode = 500, errorCode) => {
    return res.status(statusCode).json({
        error: {
            code: errorCode,
            message: message,
        },
    });
};

module.exports = {
    successResponse,
    errorResponse,
};