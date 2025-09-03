

const { Product } = require('../../libs/db/models');

const getAllProducts = async () => {
    const allProducts = await Product.findAll();
    return allProducts;
};

const getProductById = async (productId) => {
    const foundProduct = await Product.findByPk(productId);
    return foundProduct;
};

const createProduct = async (productData) => {
    const newProduct = await Product.create(productData);
    return newProduct;
};

const updateProductById = async (productId, updateData) => {
    const updateResult = await Product.update(updateData, {
        where: { id: productId }
    });
    const updatedRowCount = updateResult[0];

    if (updatedRowCount === 0) {
        return null;
    }

    const updatedProduct = await getProductById(productId);
    return updatedProduct;
};

const deleteProductById = async (productId) => {
    const deletedRowCount = await Product.destroy({
        where: { id: productId }
    });
    return deletedRowCount > 0;
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProductById,
    deleteProductById,
};