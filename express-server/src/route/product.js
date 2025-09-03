
const express = require('express');
const router = express.Router();
const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers');
const {
    allowedProductFields,
    validateProductCreation,
    filterRequestBody
} = require('../libs/middlewares');

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", filterRequestBody(allowedProductFields), validateProductCreation, createProduct);
router.put("/:id", filterRequestBody(allowedProductFields), updateProduct);
router.patch("/:id", filterRequestBody(allowedProductFields), updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;