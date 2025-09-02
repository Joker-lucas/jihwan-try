
const express = require('express');
const router = express.Router();
const {
    getAllCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer,
} = require('../controllers');
const {
    allowedCustomerFields,
    customerUpdateFields,
    validateCustomerCreation,
    filterRequestBody
} = require('../middlewares');

router.get("/", getAllCustomers);
router.get("/:id", getCustomerById);
router.post("/", filterRequestBody(allowedCustomerFields), validateCustomerCreation, createCustomer);
router.put("/:id", filterRequestBody(customerUpdateFields), updateCustomer);
router.patch("/:id", filterRequestBody(customerUpdateFields), updateCustomer);
router.delete("/:id", deleteCustomer);

module.exports = router;