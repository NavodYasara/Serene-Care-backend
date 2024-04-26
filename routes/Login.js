import express from 'express';
import {login, registerCaretaker} from '../Controller/usercontroller.js';

const router = express.Router();

router.get('/login', login); // Define the route for the login controller
router.post('/registerCaretaker',registerCaretaker); // Define the route for the register controller


export default router;