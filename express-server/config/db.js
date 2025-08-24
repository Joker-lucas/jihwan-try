// db.js
const fs = require('fs/promises');
const path = require('path');
const dataFilePath = path.join(__dirname, 'data.json');
// let products = [
//     { id: 101, name: '노트북', description: '맥북', price: 1500000 },
//     { id: 102, name: '마우스', description: '매직 마우스', price: 50000 },
//     { id: 103, name: '키보드', description: '매직 키보드', price: 120000 }
// ];
const readData = async () => {
    try {
        const data = await fs.readFile(dataFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.log("데이터 파일을 찾을 수 없습니다.");
        return {
            products: [],
            customers: []
        };
    }
};

const writeData = async (data) => {
    const jsonString = JSON.stringify(data, null, 2);
    await fs.writeFile(dataFilePath, jsonString, 'utf8');
};

let data = {
    products: [],
    customers: []
};

const initialize = async () => {
    data = await readData();
};

const getProducts = () => {
    return data.products;
};

const findPID = (id) => {
    return data.products.find(product => product.id === parseInt(id));
};

const addProduct = async (newProduct) => {
    let maxId = 0;
    if (data.products.length > 0) {
        for (const product of data.products) {
            if (product.id > maxId) {
                maxId = product.id;
            }
        }
    } else {
        maxId = 100;
    }

    const newId = maxId + 1;
    const productWithId = Object.assign({ id: newId }, newProduct);

    data.products.push(productWithId);
    await writeData(data);
    return productWithId;
};

const updateProduct = async (id, updateData) => {
    const index = data.products.findIndex(product => product.id === parseInt(id));
    if (index === -1) {
        return null;
    }
    updateData.id = parseInt(id); 
    data.products[index] = updateData;
    await writeData(data);
    return data.products[index];
};

const updateProductPartial = async (id, partialUpdateData) => {
    const index = data.products.findIndex(product => product.id === parseInt(id));
    if (index === -1) {
        return null;
    }

    const updatedProduct = Object.assign(data.products[index], partialUpdateData);
    await writeData(data);
    return updatedProduct;
};

const deleteProduct = async (id) => {
    const initialLength = data.products.length;
    data.products = data.products.filter(product => product.id !== parseInt(id));
    if (data.products.length < initialLength) {
        await writeData(data);
        return true;
    }
    return false;
};

const getCustomers = () => {
    return data.customers;
};

const findCID = (id) => {
    return data.customers.find(customer => customer.id === parseInt(id));
};

const addCustomer = async (newCustomer) => {
    const isExist = data.customers.find(customer => customer.uid === newCustomer.uid);
    if (isExist) {
        return null;
    }

    let maxId = 0;
    if (data.customers.length > 0) {
        for (const customer of data.customers) {
            if (customer.id > maxId) {
                maxId = customer.id;
            }
        }
    } else {
        maxId = 0;
    }

    const newId = maxId + 1;
    const customerWithId = Object.assign({ id: newId }, newCustomer);
    data.customers.push(customerWithId);
    await writeData(data);
    return customerWithId;
};

const updateCustomer = async (id, updateData) => {
    const index = data.customers.findIndex(customer => customer.id === parseInt(id));
    if (index === -1) {
        return null;
    }
    updateData.id = parseInt(id);
    data.customers[index] = updateData;
    await writeData(data);
    return data.customers[index];
};

const updateCustomerPartial = async (id, partialUpdateData) => {
    const index = data.customers.findIndex(customer => customer.id === parseInt(id));
    if (index === -1) {
        return null;
    }
    const updatedCustomer = Object.assign(data.customers[index], partialUpdateData);
    await writeData(data);
    return updatedCustomer;
};

const deleteCustomer = async (id) => {
    const initialLength = data.customers.length;
    data.customers = data.customers.filter(customer => customer.id !== parseInt(id));
    if (data.customers.length < initialLength) {
        await writeData(data);
        return true;
    }
    return false;
};

module.exports = {
    initialize,
    getProducts,
    findPID,
    addProduct,
    updateProduct,
    updateProductPartial,
    deleteProduct,
    getCustomers,
    findCID,
    addCustomer,
    updateCustomer,
    updateCustomerPartial,
    deleteCustomer
};