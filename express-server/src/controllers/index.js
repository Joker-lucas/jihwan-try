const customerController = require('./customer');
const productController = require('./product');

module.exports = {
    ...customerController,
    ...productController,
};