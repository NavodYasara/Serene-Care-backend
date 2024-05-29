import express from 'express';
import {  getCaretakerInformation, getCaregivers, getCaretakerById } from '../Controller/managerController.js';

const router = express.Router();


router.get('/getCaretakerInformation', getCaretakerInformation);
router.get('/getCaretakerById/:caretakerId', getCaretakerById);
router.get('/getCaregivers', getCaregivers);

export default router;
