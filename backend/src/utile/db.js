
// const mysql = require('mysql2');
// require('dotenv').config(); // Load environment variables from .env

// // Using createPool is recommended over createConnection for better management
// const db = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     port: process.env.DB_PORT,
//     dateStrings: true,
//     connectionLimit: 10,
// });


// module.exports = db;



const mysql = require('mysql2');
require('dotenv').config(); // Load environment variables from .env

// Using createPool for better connection management
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    dateStrings: true,
    connectionLimit: 10, // Set connection limit for pooling
});

module.exports = db;
