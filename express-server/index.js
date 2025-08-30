// index.js

const path = require('path');
const express = require('express');
const customerRoute = require('./routes/customer');
const productRoute = require('./routes/product');
const { Sequelize, DataTypes } = require('sequelize');
const app = express();
const port = 3000;

app.use(express.json({ limit: '50mb' }));

app.use('/customer', customerRoute);
app.use('/product', productRoute);


const sequelize = new Sequelize('mydb', 'user', 'password', {
  host: 'localhost',
  dialect: 'postgres',
  schema: 'public'
});

const Customer = sequelize.define('Customer', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  
  tableName: 'customer', 
  timestamps: false     
});

const dataView = async () => {
  const customers = await Customer.findAll({
    attributes: ['id', 'name', 'email', 'age']
  })

  console.log ('-----고객 정보------');
        for (const customer of customers) {
          console.log(customer.toJSON());
        }
        console.log ('-------------------------------------------');


};


const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.dir('데이터베이스 연결 성공');   
        await dataView();
        


        const newCustomer_build = Customer.build({
          name: '이철수',
          email: 'wasdxz3@naver.com',
          age: 40
        });

        console.log('build 테스트', newCustomer_build.toJSON());

        await newCustomer_build.save();
        
        console.log('save 확인', newCustomer_build.toJSON());

        await dataView();
        

        const newCustomer_create = await Customer.create({
          name: '한소희',
          age: 31
        });

        console.log(await newCustomer_create.toJSON());



        newCustomer_create.set({
          name: '김두솔',
          age: 26
        });
        await newCustomer_create.save();
        console.log("set을 이용한 수정", newCustomer_create.toJSON());
        await dataView();

        await newCustomer_create.update({
          email: 'dosol@example.com'
        });

        console.log("update를 이용한 수정", newCustomer_create.toJSON());
        await dataView();




        newCustomer_create.age = 30; 
        console.log('로컬 객체의 나이:', newCustomer_create.age);
        await newCustomer_create.reload(); 
        console.log('데이터베이스에서 다시 불러온 나이:', newCustomer_create.age);
        await dataView();


        app.listen(port, () => {
            console.log(`서버 실행 중... 포트번호: ${port}!`);
        });
    } catch (error) {
        console.error('데이터베이스 연결 실패:', error);
    }
};

startServer();



