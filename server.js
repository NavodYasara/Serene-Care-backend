import express from 'express'
import mysql from 'mysql2'
import cors from 'cors'
import loginRoutes from './routes/userRoutes.js'

const app = express(); // Create an Express application as middleware
app.use(cors()); // Enable CORS for all requests
app.use(express.json()); // Enable parsing JSON request bodies using the middleware

// Create a MySQL connection

export const db =  mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'serene_care_solution'
});

app.use('/server', loginRoutes);

// Start the Express server
app.listen(5000, () => {
    console.log('server working');
})

// Connect to MySQL

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Define a route to retrieve all users
app.get('/user', (req, res) => {
    // Define the SQL query to retrieve data from the user table
    const sql = 'SELECT * FROM user';

    // Execute the query
    db.query(sql, (err, results) => {
        if (err) {
            // If there's an error, send a 500 Internal Server Error response
            console.error(err.message);
            res.status(500).json(err.message);
        } else {
            // If the query is successful, send the results as a JSON response
            res.json(results);
        }
    });

});



