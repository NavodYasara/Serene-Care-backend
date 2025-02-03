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


export const loginService = (email, password, role) => {
    return new Promise((resolve,reject) => {
        const userLoginData = `SELECT userId, email, password, role FROM user WHERE email = ? AND password = ? AND role = ?`;
        db.query(userLoginData, [email, password, role], (err, result)=> {
            if (err) {
                reject(err);
            } else if (result.length > 0) {
                const user = result[0];
                resolve(user);
            } else {
                reject("Invalid email or password");
            }
        });
    });
};




