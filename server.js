import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
const PORT = process.env.PORT;

dotenv.config(); // Load environment variables from .env file
const app = express(); // Create an Express application as middleware
app.use(cors()); // Enable CORS for all requests
app.use(express.json()); // Enable parsing JSON request bodies using the middleware


app.use('/api/user', authRoutes);


//-------------- Start the Express server --------------
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// // -------------- Handle 404 errors -------------------
// app.use((req, res) => {
//   res.status(404).json({ error: 'Not Found' });
// });