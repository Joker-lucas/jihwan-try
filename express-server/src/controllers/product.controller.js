const { productService } = require('../services');


const getAllProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        console.error("상품 목록 조회 중 에러:", error);
        res.status(500).json({ errorMsg: '서버 오류가 발생했습니다.' });
    }
};

const getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await productService.getProductById(productId);

        if (!product) {
            return res.status(404).json({ errorMsg: '존재하지 않는 상품입니다.' });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error("상품 조회 중 에러:", error);
        res.status(500).json({ errorMsg: '서버 오류가 발생했습니다.' });
    }
};

const createProduct = async (req, res) => {
    try {
        const newProduct = await productService.createProduct(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        console.error("상품 생성 중 에러:", error);
        res.status(500).json({ errorMsg: '서버 오류가 발생했습니다.' });
    }
};

const updateProduct = async (req, res) => {
    
    try {
        const productId = req.params.id;
        const updatedProduct = await productService.updateProductById(productId, req.body);

        if (!updatedProduct) {
            return res.status(404).json({ errorMsg: '존재하지 않는 상품입니다.' });
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error("상품 수정 중 에러:", error);
        res.status(500).json({ errorMsg: '서버 오류가 발생했습니다.' });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const isDeleted = await productService.deleteProductById(productId);

        if (!isDeleted) {
            return res.status(404).json({ errorMsg: '존재하지 않는 상품입니다.' });
        }
        res.status(200).json({ message: '성공적으로 삭제되었습니다.' });
    } catch (error) {
        console.error("상품 삭제 중 에러:", error);
        res.status(500).json({ errorMsg: '서버 오류가 발생했습니다.' });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};