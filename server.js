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




