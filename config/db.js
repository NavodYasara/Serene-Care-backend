
import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10, // Set a limit to avoid overloading
    queueLimit: 0
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error("❌ MySQL Connection Failed:", err);
    } else {
        console.log("✅ MySQL Connected Successfully!");
        connection.release(); // Release the connection back to the pool
    }
});

export default pool;
