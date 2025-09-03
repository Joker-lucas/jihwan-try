const { Customer } = require('../libs/db/models');

const getAllCustomers = async () => {
    const allCustomers = await Customer.findAll({
        attributes: { exclude: ['password'] }
    });
    return allCustomers;
};

const getCustomerById = async (customerId) => {
    const foundCustomer = await Customer.findByPk(customerId, {
        attributes: { exclude: ['password'] }
    });
    return foundCustomer;
};

const createCustomer = async (customerData) => {
    const newCustomer = await Customer.create(customerData);
    return newCustomer;
};

const updateCustomerById = async (customerId, updateData) => {
    const updateResult = await Customer.update(updateData, {
        where: { id: customerId }
    });
    const updatedRowCount = updateResult[0];

    if (updatedRowCount === 0) {
        return null;
    }

    const updatedCustomer = await getCustomerById(customerId);
    return updatedCustomer;
};

const deleteCustomerById = async (customerId) => {
    const deletedRowCount= await Customer.destroy({
        where: { id: customerId }
    });
    return deletedRowCount > 0;
};

module.exports = {
    getAllCustomers,
    getCustomerById,
    createCustomer,
    updateCustomerById,
    deleteCustomerById,
};