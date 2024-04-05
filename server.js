const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const path = require('path');

const app = express()

app.use(express.static(path.join(__dirname, 'build'))); //middleware to serving static files
app.use(cors())  //managing web security
app.use(express.json())  //parse json data from http requests

const port = 5000

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "serene_care_solution"
}) 

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})


