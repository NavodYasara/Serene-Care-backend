import express from 'express';
import {login, registerCaretaker, userDetails} from '../Controller/usercontroller.js';

const router = express.Router();

router.post('/userRoutes', registerCaretaker); // Define the route for the login controller
router.post('/login',login); // Define the route for the register controller
router.get('/user', userDetails); // Define the route for the userDetails controller


export default router;