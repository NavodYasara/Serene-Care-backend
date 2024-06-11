import express from 'express';
import { getCareplans } from "../Controller/careplanController.js";

const router = express.Router();

router.get('/getCareplans', getCareplans);

export default router;


