import express from 'express';

import { insertRequirement, insertRequest,getAllRequirements } from '../Controller/requirementController.js';

const router = express.Router();

router.post('/insertRequirement', insertRequirement); // Route to insert a new requirement
router.post('/insertRequest', insertRequest); // Route to insert a new request
// router.get('/requirements', getAllRequirements); // Route to get all requirements
export default router;
