const { customerService } = require('../services');
const { Sequelize } = require('../libs/db/models');

const getAllCustomers = async (req, res) => {
    try {
        const customers = await customerService.getAllCustomers();
        res.status(200).json(customers);
    } catch (error) {
        console.error("고객 목록 조회 중 에러:", error);
        res.status(500).json({ errorMsg: '서버 오류가 발생했습니다.' });
    }
};

const getCustomerById = async (req, res) => {
    try {
        const customerId = req.params.id;
        const customer = await customerService.getCustomerById(customerId);

        if (!customer) {
            return res.status(404).json({ errorMsg: '존재하지 않는 고객입니다.' });
        }

        res.status(200).json(customer);
    } catch (error) {
        console.error("고객 조회 중 에러:", error);
        res.status(500).json({ errorMsg: '서버 오류가 발생했습니다.' });
    }
};

const createCustomer = async (req, res) => {
    try {
        const newCustomer = await customerService.createCustomer(req.body);
        const { password, ...customerData } = newCustomer.toJSON();
        res.status(201).json(customerData);
    } catch (error) {
        console.error("고객 생성 중 에러:", error);
        res.status(500).json({ errorMsg: '서버 오류가 발생했습니다.' });
    }
};

const updateCustomer = async (req, res) => {
    try {
        const customerId = req.params.id;
        const updatedCustomer = await customerService.updateCustomerById(customerId, req.body);

        if (!updatedCustomer) {
            return res.status(404).json({ errorMsg: '존재하지 않는 고객입니다.' });
        }

        res.status(200).json(updatedCustomer);
    } catch (error) {
        console.error("고객 수정 중 에러:", error);
        res.status(500).json({ errorMsg: '서버 오류가 발생했습니다.' });
    }
};

const deleteCustomer = async (req, res) => {
    try {
        const customerId = req.params.id;
        const isDeleted = await customerService.deleteCustomerById(customerId);

        if (!isDeleted) {
            return res.status(404).json({ errorMsg: '존재하지 않는 고객입니다.' });
        }

        res.status(200).json({ message: '성공적으로 삭제되었습니다.' });
    } catch (error) {
        console.error("고객 삭제 중 에러:", error);
        res.status(500).json({ errorMsg: '서버 오류가 발생했습니다.' });
    }
};

module.exports = {
    getAllCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer,
};