import express from 'express';
import { insertRequirement, getAllRequirements } from '../Controller/requirementController.js';
import { verifyTokenAndCheckRole } from '../jwtUtils.js';

const router = express.Router();


// Route to insert a new requirement
router.post('/requirement', verifyTokenAndCheckRole(['caretaker']),insertRequirement);

// Route to get all requirements
router.get('/requirements', verifyTokenAndCheckRole(['caregiver','manager','admin']), getAllRequirements);

export default router;
