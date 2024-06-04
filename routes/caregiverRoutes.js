import express from 'express';
import { getrequestedcaretakers, acceptrequest, assignedcaretakers } from '../Controller/caregiverController.js';

const router = express.Router();

router.get('/getrequestedcaretakers', getrequestedcaretakers);
router.put('/acceptrequest/:caretakerId', acceptrequest);
router.get('/assignedcaretakers', assignedcaretakers);
// router.put('/rejectrequest/:caretakerId', rejectRequest);


export default router;
