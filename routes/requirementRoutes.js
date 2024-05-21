import express from 'express';

import { insertRequirement, getAllRequirements } from '../Controller/requirementController.js';

const router = express.Router();

router.post('/requirement', insertRequirement); // Route to insert a new requirement
router.get('/requirements', getAllRequirements); // Route to get all requirements

export default router;
