import express from 'express';
import {
    login,
    userRegister,
    // userDetails,
    // getCaretakerDetails,
    } from '../controller/userController.js';


const router = express.Router();

router.post('/userRegister', userRegister);
router.post('/login',login); // Define the route for the login controller
// router.get('/userDetails', userDetails); // client makes a GET request to /userDetails,router will call the userDetails function.
// router.get('/caretakerDetails', getCaretakerDetails); 


export default router;
