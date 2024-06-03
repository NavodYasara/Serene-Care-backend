import express from 'express';
import { getrequestedcaretakers, acceptrequest } from '../Controller/caregiverController.js';

const router = express.Router();

router.get('/getrequestedcaretakers', getrequestedcaretakers);
router.put('/acceptrequest/:caretakerId', acceptrequest);

export default router;
