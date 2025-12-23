const config = {    
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: 'postgres',
    host: process.env.HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    dialect: 'postgres',
}


export default config;