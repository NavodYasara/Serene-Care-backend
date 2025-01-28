import mysql from 'mysql2'
import { Pool } from 'pg';
import dotenv from 'dotenv';
// const mysql = require('mysq2');

// Database connection configuration
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'serene_care_solution'
}).promise();

// export default db;

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
});

export default pool;

// Connect to MySQL
// db.connect((err) => {
//     if (err) {
//         console.error('Error connecting to MySQL:', err);
//         return;
//     }
//     console.log('Connected to MySQL database');
// });