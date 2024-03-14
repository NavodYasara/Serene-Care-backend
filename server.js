import express from 'express';
import mysql from 'mysql'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import cookieparser from 'cookie-parser'


const app = express() // create express app
app.use(express.json()) // for parsing application/json
app.use(cors()) // for enabling cors
app.use(cookieparser()) // for parsing cookies

// create mysql connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "login"
})

// start express server on port 3001
app.listen(8081, () => {
    console.log('Server is running on port 8081');
})



