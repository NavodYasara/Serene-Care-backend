import express from 'express';

import {
  fetchSystemPerformanceData,
  requirementsDueThisMonth,
  recurringRequirements,
  requirementsStartedThisMonth,
  requirementsAssignedToEachCaretaker,
  requirementsCompletedByEachCaretaker,
  totalCaretakersServed,
  feedbackThisMonth,
} from "../Controller/reportController.js";

const router = express.Router();

// router.get("/system-performance", fetchSystemPerformanceData);
router.get("/requirements-due-this-month", requirementsDueThisMonth);
router.get("/recurring-requirements", recurringRequirements);
router.get("/requirements-started-this-month", requirementsStartedThisMonth);
router.get("/requirements-Assigned-To-Each-Caretaker",requirementsAssignedToEachCaretaker);
router.get("/requirements-Completed-By-EachCaretaker",requirementsCompletedByEachCaretaker);
router.get("/total-caretakers-served", totalCaretakersServed);
router.get("/feedback-this-month", feedbackThisMonth);

export default router;
