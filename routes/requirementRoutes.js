import express from 'express';

import {  insertRequest,getAllRequirements,insertRequirement, getAllcaretakers } from '../Controller/requirementController.js';

const router = express.Router();

router.post('/insertRequirement', insertRequirement); // Route to insert a new requirement
router.post('/insertRequest', insertRequest); // Route to insert a new request
router.get('/getrequirements', getAllRequirements); // Route to get all requirements
router.get('/getAllcaretakers', getAllcaretakers); // Route to get all caretakers
export default router;
