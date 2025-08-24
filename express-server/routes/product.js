const express = require('express');
const router = express.Router();
const db = require('../config/db');

router
.get("/", async (req, res) => {
    res.status(200).json(db.getProducts());
})
.get("/:id", async (req, res) => {
    const product = db.findPID(req.params.id);

    if (product) {
        res.status(200).json(product);
    } else {
        res.status(404).json({ errorMsg: '존재하지 않는 상품입니다.' });
    }
})
.post("/", async (req, res) => {
    const newProductData = req.body;
    const errors = {};

    if (!newProductData.name) {
        errors.name = '상품명이 누락되었습니다.';
    }
    if (!newProductData.description) {
        errors.description = '상품설명이 누락되었습니다.';
    }
    if (!newProductData.price) {
        errors.price = '가격이 누락되었습니다.';
    }
    
    if (Object.keys(errors).length > 0) {
        return res.status(400).json(errors);
    }

    const result = await db.addProduct(newProductData);

    if (result === null) {
        res.status(409).json({ errorMsg: '중복된 아이디가 있습니다.' });
    } else {
        res.status(200).json(result); 
    }
})
.put("/:id", async (req, res) => {
    const productId = req.params.id;
    const updateData = req.body;

    if ( !updateData.name || !updateData.description || !updateData.price) {
        return res.status(400).json({ errorMsg: '필수 필드가 누락되었습니다.' });
    }

    const result = await db.updateProduct(productId, updateData);

    if (result === null) {
        res.status(404).json({ errorMsg: '존재하지 않는 상품입니다.' });
    } else {
        res.status(200).json(result);
    }
})
.patch("/:id", async (req, res) => {
    const productId = req.params.id;
    const updateData = req.body;

    const result = await db.updateProductPartial(productId, updateData);

    if (result === null) {
        res.status(404).json({ errorMsg: '존재하지 않는 상품입니다.' });
    } else {
        res.status(200).json(result);
    }
})
.delete("/:id", async (req, res) => {
    const productId = req.params.id;
    const isDeleted = await db.deleteProduct(productId); 
    if (isDeleted) {
        res.status(200).json({ message: '삭제 성공' });
    } else {
        res.status(404).json({ errorMsg: '존재하지 않는 상품입니다.' });
    }
});

module.exports = router;