import express from "express";

import {
  addfeedback,
  getcaregiver,
  getcaretakers,
  getCaregiversByCaretaker,
  getFeedbackHistory,
} from "../Controller/feedbackController.js";

const router = express.Router();

router.post("/addfeedback", addfeedback);
router.get("/getcaregiver/:userId", getcaregiver);
router.get("/getcaretakers/:userId", getcaretakers);
router.get("/getcaregivers/:caretakerId", getCaregiversByCaretaker);
router.get("/getfeedbackhistory/:requirmentId", getFeedbackHistory);

export default router;