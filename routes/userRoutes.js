import express from 'express';
import {login, registerCaretaker, userDetails} from '../Controller/usercontroller.js';

const router = express.Router();

router.post('/registerCaretaker', registerCaretaker);
router.post('/login',login); // Define the route for the login controller
router.get('/user', userDetails); // Define the route for the userDetails controller

export default router;
