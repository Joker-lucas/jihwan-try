const express = require('express');
const router = express.Router();
const db = require('../config/db');

router
.get("/", async (req, res) => {
    res.status(200).json(db.getCustomers());
})
.get("/:id", async (req, res) => {
    const customer = db.findCID(req.params.id);

    if (customer) {
        res.status(200).json(customer);
    } else {
        res.status(404).json({ errorMsg: '존재하지 않는 고객입니다.' });
    }
})
.post("/", async (req, res) => {
    const newCustomerData = req.body;
    const errors = {};

    if (!newCustomerData.uid) {
        errors.uid = 'uID가 누락되었습니다.';
    }
    if (!newCustomerData.name) {
        errors.name = '이름이 누락되었습니다.';
    }
    if (!newCustomerData.email) {
        errors.email = '이메일이 누락되었습니다.';
    }
    if (Object.keys(errors).length > 0) {
        return res.status(400).json(errors);
    }

    const result = await db.addCustomer(newCustomerData);

    if (result === null) {
        res.status(409).json({ errorMsg: '중복된 아이디가 있습니다.' });
    } else {
        res.status(200).json(result);
    }
})
.put("/:id", async (req, res) => {
    const customerId = req.params.id;
    const updateData = req.body;

    if (!updateData.uid || !updateData.name || !updateData.email) {
        return res.status(400).json({ errorMsg: '필수 필드가 누락되었습니다.' });
    }

    const result = await db.updateCustomer(customerId, updateData);

    if (result === null) {
        res.status(404).json({ errorMsg: '존재하지 않는 고객입니다.' });
    } else {
        res.status(200).json(result);
    }
})
.patch("/:id", async (req, res) => {
    const customerId = req.params.id;
    const updateData = req.body;

    const result = await db.updateCustomerPartial(customerId, updateData);

    if (result === null) {
        res.status(404).json({ errorMsg: '존재하지 않는 고객입니다.' });
    } else {
        res.status(200).json(result);
    }
})
.delete("/:id", async (req, res) => {
    const customerId = req.params.id;
    const isDeleted = await db.deleteCustomer(customerId);

    if (isDeleted) {
        res.status(200).json({ message: '삭제 성공' });
    } else {
        res.status(404).json({ errorMsg: '존재하지 않는 고객입니다.' });
    }
});

module.exports = router;