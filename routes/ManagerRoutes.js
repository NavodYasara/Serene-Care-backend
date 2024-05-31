import express from 'express';
import {  getCaretakerInformation, getCaregivers, getCaretakerById, allocateCaregiver, getCaregiverById} from '../Controller/managerController.js';



const router = express.Router();

router.get('/getCaretakerInformation', getCaretakerInformation);
router.get('/getCaretakerById/:caretakerId', getCaretakerById);
router.get('/getCaregivers', getCaregivers);
router.put('/allocateCaregiver', allocateCaregiver);
router.get("/getCaregiverById/:caregiverId", getCaregiverById);

export default router;
