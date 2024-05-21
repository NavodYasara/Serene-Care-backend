import express from 'express';

import { insertRequirement, getAllRequirements } from '../Controller/requirementController.js';

const router = express.Router();

// Route to insert a new requirement
router.post('/requirement', insertRequirement);

// Route to get all requirements
router.get('/requirements', getAllRequirements);

export default router;
