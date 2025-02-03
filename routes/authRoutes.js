import express from 'express';
import { Router } from 'express';
import {registerController} from '../controller/authController.js';
import {loginController} from '../controller/authController.js';
const router = Router();

// Register a new user
router.post('/register', registerController);
router.post('/login', loginController);

export default router;
