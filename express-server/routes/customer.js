//customer.js
const express = require('express');
const router = express.Router();
const db = require('../config/db'); 
const { customerFields, validateCustomer, filterRequestBody, validateCustomerUpdate } = require('../config/validation');

router
.get("/", async (req, res) => {
    try {
        res.status(200).json(await db.getCustomers());
    } catch (error) {
        console.error("고객 목록 조회 중 에러:", error);
        res.status(500).json({ errorMsg: '서버 오류 발생.' });
    }
})

.get("/:id", async (req, res) => {
    try {
        const customer = await db.findCID(req.params.id);
        if (customer) {
            res.status(200).json(customer);
        } else {
            res.status(404).json({ errorMsg: '존재하지 않는 고객입니다.' });
        }
    } catch (error) {
        console.error(`ID ${req.params.id} 고객 조회 중 에러:`, error);
        res.status(500).json({ errorMsg: '서버 오류 발생.' });
    }
})

.post("/", validateCustomer, filterRequestBody(customerFields), async (req, res) => {
    try {
        const result = await db.addCustomer(req.body);
        if (result === null) {
            res.status(409).json({ errorMsg: '이미 존재하는 uid 입니다.' });
        } else {
            res.status(201).json(result);
        }
    } catch (error) {
        console.error("고객 생성 중 에러:", error);
        res.status(500).json({ errorMsg: '서버 오류 발생.' });
    }
})

.put("/:id", validateCustomerUpdate, filterRequestBody(customerFields), async (req, res) => {
    try {
        const result = await db.updateCustomer(req.params.id, req.body);
        if (result === null) {
            res.status(404).json({ errorMsg: '존재하지 않는 고객입니다.' });
        } else {
            res.status(200).json(result);
        }
    } catch (error) {
        console.error(`ID ${req.params.id} 고객 수정 중 에러:`, error);
        res.status(500).json({ errorMsg: '서버 오류 발생.' });
    }
})

.patch("/:id", filterRequestBody(customerFields), async (req, res) => {
    try {
        const result = await db.updateCustomerPartial(req.params.id, req.body);
        if (result === null) {
            res.status(404).json({ errorMsg: '존재하지 않는 고객입니다.' });
        } else {
            res.status(200).json(result);
        }
    } catch (error) {
        console.error(`ID ${req.params.id} 고객 부분 수정 중 에러:`, error);
        res.status(500).json({ errorMsg: '서버 오류 발생.' });
    }
})

.delete("/:id", async (req, res) => {
    try {
        const isDeleted = await db.deleteCustomer(req.params.id);
        if (isDeleted) {
            res.status(200).json({ message: '삭제 성공' });
        } else {
            res.status(404).json({ errorMsg: '존재하지 않는 고객입니다.' });
        }
    } catch (error) {
        console.error(`ID ${req.params.id} 고객 삭제 중 에러:`, error);
        res.status(500).json({ errorMsg: '서버 오류 발생.' });
    }
});

module.exports = router;