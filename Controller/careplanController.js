import { db } from "../server.js";


export const getcaretakerDetails = (req, res) => {
    const sql = '';
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err.message);
            res.status(500).json(err.message);
        } else {
            res.json(results);
        }
    });
}