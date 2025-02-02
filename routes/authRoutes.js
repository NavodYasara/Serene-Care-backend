import express from 'express';
import { Router } from 'express';
import {registerController} from '../controller/authController.js';

const router = Router();

// Register a new user
router.post('/register', registerController);

export default router;
