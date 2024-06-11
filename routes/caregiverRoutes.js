import express from 'express';
import {
  getrequestedcaretakers,
  acceptrequest,
  assignedcaretakers,
  rejectRequest,
  getAllRequirements,
  getRequrimentRelatedToUserID,
  
} from "../Controller/caregiverController.js";

const router = express.Router();

router.get('/getrequestedcaretakers', getrequestedcaretakers);
router.patch('/acceptrequest', acceptrequest);
router.get('/assignedcaretakers', assignedcaretakers);
router.put('/rejectrequest/:caretakerId', rejectRequest);
router.get("/getAllRequirements", getAllRequirements);
router.get("/requirmentrelatedToCareGiver", getRequrimentRelatedToUserID);


export default router;
