import pool from './config/db.js';

pool.query('SELECT NOW()', (err, results) => {
    if (err) {
        console.error("❌ Query Failed:", err);
    } else {
        console.log("✅ Database Connection Successful:", results);
    }
    pool.end(); // Close the pool after testing
});
