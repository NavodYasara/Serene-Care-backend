import { db } from "../server.js";

export const getrequestedcaretakers = (req, res) => {
    try {
        db.query("SELECT * FROM requirement r WHERE r.status = 'Pending'", (err, results) => {
            if (err) {
                console.error('Error connecting to MySQL:', err);
                return;
            } else {
                res.json(results);
            }
        });
    } catch (error) {
        console.error(error.message);
    }
};
