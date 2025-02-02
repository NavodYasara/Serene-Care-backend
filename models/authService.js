import db from '../config/db.js' ;
import jwt from 'jsonwebtoken' ;
import bcrypt from 'bcrypt' ;
import { promise } from 'bcrypt/promises.js';


export default registerService = () => {
    return new promise((resolve,reject) => {
        const userRegister = `INSERT INTO users (firstName,lastName,userName,email,password,role) values (?,?,?,?,?,?)`;
        db.query(userRegister, [firstName,lastName,userName,email,password,role], (err, result) => {
            if(err) {
                reject(err);
            }
            resolve(result);
        });
    });
};

// export default loginService = () => {};