import express from 'express';
import {login, register} from '../Controller/usercontroller.js';

const router = express.Router();

router.get('/login', login); // Define the route for the login controller
router.post('/register', register); // Define the route for the register controller



export default router;