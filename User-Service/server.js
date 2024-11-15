import express from 'express';
import { json } from 'body-parser';

const app = express();
const port = process.env.PORT || 3000;
const routes = require('./routes');routes(app);

// Middleware
app.use(json());

// Routes
app.get('/', (req, res) => {
    res.send('User Service is running');
});

// Start the server
app.listen(port, () => {
    console.log(`User Service is running on port ${port}`);
});