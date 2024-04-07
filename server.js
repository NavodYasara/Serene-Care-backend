// const express = require('express');
// const mysql = require('mysql');
// const cors = require('cors');
// const path = require('path');

// const app = express()

// app.use(express.static(path.join(__dirname, 'build'))); //middleware to serving static files
// app.use(cors())  //managing web security
// app.use(express.json())  //parse json data from http requests


// const port = 5000

// // const db = mysql.createConnection({
// //     host: "localhost",
// //     user: "root",
// //     password: "",
// //     database: "serene_care_solution"
// // }) 

// // app.post('/add_user', (req, res) => {
// //     sql = "INSERT INTO caretaker('first_name_caretaker','first_name_caretaker','address','caretaker_catagory') VALUES (?,?,?,?)";
// //     const values = [
// //         req.body.first_name_caretaker,
// //         req.body.last_name_caretaker,
// //         req.body.address,
// //         req.body.caretaker_catagory
// //     ]
// //     db.query (sql, values, (err, result) => {
// //         if (err) return res.json({message: 'something unexpected has occured' + err})
// //         return res.json({message: 'User added successfully'})
// //     })

// // })


// app.listen(5000, () => {
//     console.log(`Server is running on port ${port}`)
// })


const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const port = 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Your routes and other server logic go here

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});