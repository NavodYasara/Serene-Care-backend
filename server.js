import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';

import loginRoutes from './routes/userRoutes.js';
import requirementRoutes from './routes/requirementRoutes.js';
// import careplanRoutes from './routes/careplanRoutes.js';
// import reportRoutes from './routes/reportRoutes.js';
// import paymentRoutes from './routes/paymentRoutes.js';

// Create an Express application as middleware
const app = express();

// Enable CORS for all requests
app.use(cors());

// Enable parsing JSON request bodies using the middleware
app.use(express.json());

//////////// Create a MySQL connection //////////////////////////////////////////////////////////////////////////////
export const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'serene_care_solution'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

//################### Define Routes ####################################################################
app.use('/api', loginRoutes);
app.use('/api', requirementRoutes);
// app.use('/api', careplanRoutes);
// app.use('/api', reportRoutes);
// app.use('/api', paymentRoutes);

//#####################################################################################################

// Define a route to retrieve all users
app.get('/server/usernew', (req, res) => {
  const sql = 'SELECT * FROM usernew';
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err.message);
      res.status(500).json(err.message);
    } else {
      res.json(results);
    }
  });
});

// Define a route to retrieve all caretaker details
app.get('/server/caretakerDetails', (req, res) => {
  const sql = 'SELECT * FROM caretakernew';
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err.message);
      res.status(500).json(err.message);
    } else {
      res.json(results);
    }
  });
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

///////////////  Start the Express server  /////////////////////////////
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});


// import express from 'express'
// import mysql from 'mysql2'
// import cors from 'cors'

// import loginRoutes from './routes/userRoutes.js'
// import requirementRoutes from './routes/requirementRoutes.js'

// const app = express(); // Create an Express application as middleware
// app.use(cors()); // Enable CORS for all requests
// app.use(express.json()); // Enable parsing JSON request bodies using the middleware


// //////////// Create a MySQL connection //////////////////////////////////////////////////////////////////////////////

// export const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'admin',
//   database: 'serene_care_solution'
// });

// app.use('/api', loginRoutes);
// app.use('/api', requirementRoutes);

// /////////////////  Start the Express server  /////////////////////////////

// app.listen(5000, () => {
//     console.log('server working');
// })

// ///////// Connect to MySQL ////////////////////////////////////////////////////////////////////////////////////////

// db.connect((err) => {
//     if (err) {
//         console.error('Error connecting to MySQL:', err);
//         return;
//     }
//     console.log('Connected to MySQL database');
// });

// ///////////////  Define a route to retrieve all users  //////////////////////////////////////////////////////////////


// app.get('/server/usernew', (req, res) => {

//     // Define the SQL query to retrieve data from the user table
//     const sql = 'SELECT * FROM usernew';

//     // Execute the query
//     db.query(sql, (err, results) => {
//         if (err) {
//             // If there's an error, send a 500 Internal Server Error response
//             console.error(err.message);
//             res.status(500).json(err.message);
//         } else {
//             // If the query is successful, send the results as a JSON response
//             res.json(results);
//         }
//     });

// });


// //////////// Define a route to retrieve all caretaker details /////////////////////////////////////////////////////


// app.get('/server/caretakerDetails', (req, res) => {
//     const sql = 'SELECT * FROM caretaker';
//     db.query(sql, (err, results) => {
//         if (err) {
//             console.error(err.message);
//             res.status(500).json(err.message);
//         } else {
//             res.json(results);
//         }
//     });
// })


// ///////////////  Define a route to   //////////////////////////////////////////////////////////////

