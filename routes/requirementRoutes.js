import express from 'express';

import {  insertRequest,insertRequirement, getAllcaretakers } from '../Controller/requirementController.js';

const router = express.Router();

router.post('/insertRequirement', insertRequirement); // Route to insert a new requirement
router.post('/insertRequest', insertRequest); // Route to insert a new request
router.get('/getAllcaretakers', getAllcaretakers); // Route to get all caretakers
// router.get("/getAllRequirements", getAllRequirements); // Route to get all requirements
export default router;
