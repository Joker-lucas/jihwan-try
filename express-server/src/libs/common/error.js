class CustomError extends Error {
    constructor(message, statusCode, errorCode) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.name = this.constructor.name;
    }
}

class UnauthorizedError extends CustomError {
    constructor(message = '인증이 필요합니다.') {
        super(message, 401);
    }
}

class NotFoundError extends CustomError {
    constructor(message = '리소스를 찾을 수 없습니다.') {
        super(message, 404, errorCodes.USER_NOT_FOUND);
    }
}

class BadRequestError extends CustomError {
    constructor(message = '잘못된 요청입니다.') {

        super(message, 400, errorCodes.INVALID_INPUT);
    }
}

module.exports = {
    CustomError,
    UnauthorizedError,
    NotFoundError,
    BadRequestError,
}