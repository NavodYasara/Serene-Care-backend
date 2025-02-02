import db from '../config/db.js' ;
import { promise } from 'bcrypt/promises.js';


export default registerService = () => {
    return new promise((resolve,reject) => {
        const userRegister = `INSERT INTO users (firstName,lastName,email,password,role) values (?,?,?,?,?)`;
        db.query(userRegister, [firstName,lastName,email,password,role], (err, result) => {
            if(err) {
                reject(err);
            }
            resolve(result);
        });
    });
};
