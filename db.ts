import mysql from "mysql2";

// Database connection pool configuration
export const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "admin",
  database: "serene_care_solution",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

console.log("MySQL Database Connection Pool initialized");

