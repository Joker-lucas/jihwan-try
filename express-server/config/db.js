// db.js
const fs = require('fs/promises');
const path = require('path');
const dataFilePath = path.join(__dirname, 'data.json');

const readData = async () => {
    try {
        const data = await fs.readFile(dataFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.log("데이터 파일을 찾을 수 없습니다.");
        return {
            products: { productsmaxID: 100 },
            customers: { customersmaxID: 0 }
        };
    }
};

const writeData = async (data) => {
    const jsonString = JSON.stringify(data);
    await fs.writeFile(dataFilePath, jsonString, 'utf8');
};

// Product
const getProducts = async () => {
    const data = await readData();
    return Object.keys(data.products)
        .filter(key => key !== 'productsmaxID')
        .map(key => ({ id: parseInt(key), ...data.products[key] }));
};
const findPID = async (id) => {
    const data = await readData();
    const product = data.products[id];

    if (product) {
        return { id: parseInt(id), ...product };
    } else {
        return null;
    }
};
const addProduct = async (newProduct) => {
    const data = await readData();
    const newId = (data.products.productsmaxID || 0) + 1;

    data.products.productsmaxID = newId;
    data.products[newId] = newProduct;

    await writeData(data);
    return { id: newId, ...newProduct };
};
const updateProduct = async (id, updateData) => {
    const data = await readData();
    const productId = id.toString();

    if (!data.products[productId]) { 
        return null; 
    }

    data.products[productId] = updateData;

    await writeData(data);
    return { id: parseInt(productId), ...updateData };
};
const updateProductPartial = async (id, partialUpdateData) => {
    const data = await readData();
    const productId = id.toString();

    if (!data.products[productId]) { 
        return null; 
    }
    const { id: reqBodyId,  ...updateFields } = partialUpdateData;
    data.products[productId] = { ...data.products[productId], ...updateFields };

    await writeData(data);
    return { id: parseInt(productId), ...data.products[productId] };
};
const deleteProduct = async (id) => {
    const data = await readData();
    const productId = id.toString();

    if (data.products[productId]) {
        delete data.products[productId];
        await writeData(data);
        return true;
    }
    return false;
};

// Customer
const getCustomers = async () => {
    const data = await readData();
    return Object.keys(data.customers)
        .filter(key => key !== 'customersmaxID')
        .map(key => ({ id: parseInt(key), ...data.customers[key] }));
};
const findCID = async (id) => {
    const data = await readData();
    const customer = data.customers[id];
    if (customer) {
        return { id: parseInt(id), ...customer };
    } else {
        return null;
    }
};
const addCustomer = async (newCustomer) => {
    const data = await readData();
    const allCustomers = Object.values(data.customers);
    if (allCustomers.some(c => typeof c === 'object' && c.uid === newCustomer.uid)) {
        return null;
    }

    const newId = (data.customers.customersmaxID || 0) + 1;
    data.customers.customersmaxID = newId;
    data.customers[newId] = newCustomer;
    await writeData(data);
    return { id: newId, ...newCustomer };
};
const updateCustomer = async (id, updateData) => {
    const data = await readData();
    const customerId = id.toString();

    if (!data.customers[customerId]) { 
        return null; 
    }

    const existingUid = data.customers[customerId].uid;
    const customerToSave = {
        uid: existingUid,
        name: updateData.name,
        email: updateData.email
    };
    data.customers[customerId] = customerToSave;

    await writeData(data);
    return { id: parseInt(customerId), ...customerToSave };
};
const updateCustomerPartial = async (id, partialUpdateData) => {
    const data = await readData();
    const customerId = id.toString();

    if (!data.customers[customerId]) { 
        return null;
     }

    const { id: reqBodyId, uid, ...updateFields } = partialUpdateData;
    data.customers[customerId] = { ...data.customers[customerId], ...updateFields };

    await writeData(data);
    return { id: parseInt(customerId), ...data.customers[customerId] };
};
const deleteCustomer = async (id) => {
    const data = await readData();
    const customerId = id.toString();

    if (data.customers[customerId]) {
        delete data.customers[customerId];
        await writeData(data);
        return true;
    }
    return false;
};

module.exports = {
    //product
    getProducts,
    findPID,
    addProduct,
    updateProduct,
    updateProductPartial,
    deleteProduct,

    //custmoer
    getCustomers,
    findCID,
    addCustomer,
    updateCustomer,
    updateCustomerPartial,
    deleteCustomer
};