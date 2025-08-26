//validation.js

const productFields = ['name', 'description', 'price'];
const customerFields = ['uid', 'name', 'email'];
const customerUpdateFields = ['name', 'email'];

const createValidator = (requiredFields) => {
    return (req, res, next) => {
        const missingFields = [];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                missingFields.push(field);
            }
        }

        if (missingFields.length > 0) {
            return res.status(400).json({ 
                errorMsg: '필수 필드가 누락되었습니다.'
            });
        }
        next();
    };
};

const filterRequestBody = (allowedFields) => {
    return (req, res, next) => {


        if (typeof req.body !== 'object' || req.body === null || Array.isArray(req.body)) {
            return res.status(400).json({ errorMsg: '객체 형식이 아닙니다.' });
        }

        const filteredBody = {};
        for (const field of Object.keys(req.body)) {
            if (allowedFields.includes(field)) {
                filteredBody[field] = req.body[field];
            }
        }
        req.body = filteredBody;
        next();
    };
};

const validateProduct = createValidator(productFields);
const validateCustomer = createValidator(customerFields);
const validateCustomerUpdate = createValidator(customerUpdateFields);


module.exports = {
    productFields,
    customerFields,
    validateProduct,
    validateCustomer,
    validateCustomerUpdate,
    filterRequestBody
};