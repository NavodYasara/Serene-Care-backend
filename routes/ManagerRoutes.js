import express from 'express';
import { getCaretakers, getCaretakerInformation, getCaregivers } from '../Controller/managerController.js';

const router = express.Router();

router.get('/getCaretakers', getCaretakers);
router.get('/caretakerInformation', getCaretakerInformation);
// router.get('/caretakerInformation/:id', getCaretakerInformation);
router.get('/caregivers', getCaregivers);

export default router;
