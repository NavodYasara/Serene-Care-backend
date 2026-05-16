import express from 'express';

import {  insertRequest, getAllcaretakers } from '../Controller/requirementController.js';

const router = express.Router();

router.post('/insertRequest', insertRequest); // Route to insert a new request
router.get('/getAllcaretakers', getAllcaretakers); // Route to get all caretakers
// router.get("/getAllRequirements", getAllRequirements); // Route to get all requirements
export default router;
