import db from '../config/db.js';

export const registerService = (firstName, lastName, email, password, role) => {
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


export const loginService = (email, password) => {
    return new Promise((resolve,reject) => {
        const userLoginData = `SELECT * FROM user WHERE email = ? AND password = ?`;
        db.query(userLoginData, [email, password], (err, result)=> {
            if (result.length > 0) {
                resolve(result[0]);
            }
            else {
                reject("User not found");
            }
        });
    });
};
