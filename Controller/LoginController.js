import {db} from '../server.js'


export const login=(req,res)=>{

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        // Check if user exists in the database
        db.query('SELECT * FROM user WHERE username = ?', [username], async (err, results) => {
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
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};