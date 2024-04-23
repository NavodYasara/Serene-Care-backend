import { db } from '../server.js';

export const login = (req, res) => {
    const { username, password, usertype } = req.body;
    if (!username || !password || !usertype) {
        return res.status(400).json({ error: 'Username, password, and usertype are required' });
    }

    // Check if user exists in the database
    db.query('SELECT * FROM user WHERE username = ? AND usertype = ?', [username, usertype], (err, results) => {
        if (err) {
            console.error('Error during login:', err);
            return res.status(500).json({ error: 'Internal Server Error', details: err.message });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        if (password !== results[0].password) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        // Login successful
        res.status(200).json({ message: 'Login successful' });
    });
};

export const register = (req, res) => {
    const { username, password, usertype } = req.body;
    if (!username || !password || !usertype) {
        return res.status(400).json({ error: 'Username, password, and usertype are required' });
    }

    // Check if user exists in the database
    db.query('SELECT * FROM user WHERE username = ?', [username], (err, results) => {
        if (err) {
            console.error('Error during registration:', err);
            return res.status(500).json({ error: 'Internal Server Error', details: err.message });
        }

        if (results.length > 0) {
            return res.status(409).json({ error: 'Username already exists' });
        }

        // Insert the new user into the database
        db.query('INSERT INTO user SET ?', { username, password, usertype }, (err, results) => {
            if (err) {
                console.error('Error during registration:', err);
                return res.status(500).json({ error: 'Internal Server Error', details: err.message });
            }

            res.status(201).json({ message: 'User registered successfully' });
        });
    });
};
