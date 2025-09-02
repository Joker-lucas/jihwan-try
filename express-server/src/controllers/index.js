const customerController = require('./customer.controller');
const productController = require('./product.controller');

module.exports = {
    ...customerController,
    ...productController,
};