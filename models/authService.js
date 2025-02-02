import db from '../config/db.js';

const registerService = (firstName, lastName, email, password, role) => {
    return new Promise((resolve, reject) => {
        const userRegister = `INSERT INTO user (firstName, lastName, email, password, role) VALUES (?,?,?,?,?)`;
        db.query(userRegister, [firstName, lastName, email, password, role], (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
};

export default registerService;