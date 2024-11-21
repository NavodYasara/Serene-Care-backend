import express from 'express';
import cors from 'cors';
import requirementRoutes from './routes/requirementRoutes.js';
import managerRoutes from './routes/managerRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Create an Express application as middleware
const app = express();

// Enable CORS for all requests
app.use(cors());

// Enable parsing JSON request bodies using the middleware
app.use(express.json());

//////////// Create a MySQL connection //////////////////////////////////////////////////////////////////////////////
// export const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'admin',
//   database: 'serene_care_solution'
// });

// db.connect((err) => {
//   if (err) {
//     console.error('Error connecting to MySQL:', err);
//     return;
//   }
//   console.log('Connected to MySQL database');
// });

//################### Define Routes ####################################################################


app.use('/api/user', userRoutes);
app.use('/api/requirement', requirementRoutes);
app.use('/api/manager', managerRoutes);

// Define a route to retrieve all users
app.get('/api/user', (req, res) => {
  const sql = 'SELECT * FROM user';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error retrieving users:', err.message);
      res.status(500).json({ error: 'Failed to retrieve users' });
    } else {
      res.json(results);
    }
  });
});

// Define a route to retrieve all caretaker details
app.get('/api/caretakerDetails', (req, res) => {
  const sql = 'SELECT * FROM caretaker';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error retrieving caretaker details:', err.message);
      res.status(500).json({ error: 'Failed to retrieve caretaker details' });
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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});