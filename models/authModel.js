import db from '../config/db.js';
import bcrypt from 'bcryptjs';

export const registerService = (firstName, lastName, email, password, role) => {
    return new Promise((resolve, reject) => {
        
        const salt = bcrypt.genSaltSync(10);
        console.log('the salt is:',salt);
        const hashedPassword = bcrypt.hashSync(password, salt);
        console.log('the hashedPassword is:',hashedPassword);

        const userRegister = `INSERT INTO user (firstName, lastName, email, password, role) VALUES (?,?,?,?,?)`;
        db.query(userRegister, [firstName, lastName, email, hashedPassword, role], (err, result) => {
            if (err) {
                reject(err);
            }
            else if (result.length > 0) {
                resolve("User has already registered in the system");
            }
            else{
                resolve(result);
            }
            
        });
    });
};

export const loginService = (email, password) => {
    
    return new Promise((resolve,reject) => {    
        const userFindQuery = `SELECT userId, email, password, role FROM user WHERE email = ?`;
        db.query(userFindQuery, [email], (err, result)=> {
            if (err) {
                reject(err);
            } else if (result.length > 0) {
                const user = result[0];
                const isPasswordValid = bcrypt.compareSync(password, user.password);
                if (isPasswordValid) {
                    resolve(user);
                } else {
                    reject("Invalid email or password");
                }
            } else {
                reject("Invalid email or password");
            }
        });

    });
};




