const { createConnection } = require('mysql2');

// Create a connection
const connection = createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'serene_care_solution'
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Database connection failed: ', err.stack);
    return;
  }
  console.log('Connected to MySQL as ID ' + connection.threadId);
  
  // Close the connection
  connection.end();
});
