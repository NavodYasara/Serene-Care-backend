import express from 'express';
import { getrequestedcaretakers } from '../Controller/caregiverController.js';

const router = express.Router();

router.get('/getrequestedcaretakers', getrequestedcaretakers);

export default router;
