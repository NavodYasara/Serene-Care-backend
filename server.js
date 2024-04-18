import express from 'express'
import mysql from 'mysql2'
import cors from 'cors'


const app = express();
app.use(cors());

app.use(express.json());

export const db =  mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'serene_care_solution'
});

// app.use('server/login', loginRoutes);

app.listen(3001, () => {
    console.log('server working');
})

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});


app.get('/users', (req, res) => {
    // Define the SQL query to retrieve data from the user table
    const sql = 'SELECT * FROM user';

    // Execute the query
    db.query(sql, (err, results) => {
        if (err) {
            // If there's an error, send a 500 Internal Server Error response
            console.error('Error retrieving user data:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            // If the query is successful, send the results as a JSON response
            res.json(results);
        }
    });
});



