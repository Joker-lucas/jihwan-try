const modelsModule = require('./models');
const sequelize = modelsModule.sequelize;
const Customer = modelsModule.Customer;
const Product = modelsModule.Product;

const db = {
   Customer,
   Product,
};

const connectToDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('데이터베이스 연결 성공');
    } catch (error) {
        console.error('데이터베이스 연결 실패:', error);
        throw error; 
    }
};

module.exports = {
    db,
    connectToDatabase,
};