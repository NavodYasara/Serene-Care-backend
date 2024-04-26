import express from 'express';
import {login, registerCaretaker} from '../Controller/usercontroller.js';

const router = express.Router();

router.post('/userRoutes', registerCaretaker); // Define the route for the login controller
router.post('/login',login); // Define the route for the register controller


export default router;