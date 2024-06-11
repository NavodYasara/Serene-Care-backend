import express from 'express';
import { fetchSystemPerformanceData } from "../Controller/reportController.js";

const router = express.Router();

router.get("/system-performance", fetchSystemPerformanceData);

export default router;
