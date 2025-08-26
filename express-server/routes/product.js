//product.js

const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { productFields, validateProduct, filterRequestBody } = require('../config/validation');

router
.get("/", async (req, res) => {
    try {
        res.status(200).json(await db.getProducts());
    } catch (error) {
        console.error("상품 목록 조회 중 에러:", error);
        res.status(500).json({ errorMsg: '서버 오류 발생.' });
    }
})
.get("/:id", async (req, res) => {
    try {
        const product = await db.findPID(req.params.id);
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ errorMsg: '존재하지 않는 상품입니다.' });
        }
    } catch (error) {
        console.error(`ID ${req.params.id} 상품 조회 중 에러:`, error);
        res.status(500).json({ errorMsg: '서버 오류 발생.' });
    }
})
.post("/", validateProduct, filterRequestBody(productFields), async (req, res) => {
    try {
        const result = await db.addProduct(req.body);
        res.status(201).json(result);
    } catch (error) {
        console.error("상품 생성 중 에러:", error);
        res.status(500).json({ errorMsg: '서버 오류 발생.' });
    }
})

.put("/:id", validateProduct, filterRequestBody(productFields), async (req, res) => {
    try {
        const productId = req.params.id;
        const result = await db.updateProduct(productId, req.body);

        if (result === null) {
            res.status(404).json({ errorMsg: '존재하지 않는 상품입니다.' });
        } else {
            res.status(200).json(result);
        }
    } catch (error) {
        console.error(`ID ${req.params.id} 상품 수정 중 에러:`, error);
        res.status(500).json({ errorMsg: '서버 오류 발생.' });
    }
})

.patch("/:id", filterRequestBody(productFields), async (req, res) => { 
    try {
        const productId = req.params.id;
    
        const result = await db.updateProductPartial(productId, req.body);

        if (result === null) {
            res.status(404).json({ errorMsg: '존재하지 않는 상품입니다.' });
        } else {
            res.status(200).json(result);
        }
    } catch (error) {
        console.error(`ID ${req.params.id} 상품 부분 수정 중 에러:`, error);
        res.status(500).json({ errorMsg: '서버 오류 발생.' });
    }
})


.delete("/:id", async (req, res) => {
    try {
        const productId = req.params.id;
        const isDeleted = await db.deleteProduct(productId); 
        
        if (isDeleted) {
            res.status(200).json({ message: '삭제 성공' });
        } else {
            res.status(404).json({ errorMsg: '존재하지 않는 상품입니다.' });
        }
    } catch (error) {
        console.error(`ID ${req.params.id} 상품 삭제 중 에러:`, error);
        res.status(500).json({ errorMsg: '서버 오류 발생.' });
    }
});


module.exports = router;