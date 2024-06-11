import express from "express";

import { addfeedback, getcaregiver } from "../Controller/feedbackController.js";
const router = express.Router();

router.post("/addfeedback", addfeedback);
router.get("/getcaregiver/:userId", getcaregiver);

export default router;