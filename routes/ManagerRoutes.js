import express from 'express';
import {
  getCaretakerInformation,
  getCaregivers,
  getCaretakerById,
  allocateCaregiver,
  getCaregiverById,
  handleinstruction,
  getAllPendingTasks,
  updateCaregiverAndInstructions,
  getAllAssignedAndRejectedTasks,
  getFinalizedPlans,
  
} from "../Controller/managerController.js";



const router = express.Router();

router.get('/getCaretakerInformation', getCaretakerInformation);
router.get('/getCaretakerById/:caretakerId', getCaretakerById);
router.get('/getCaregivers', getCaregivers);
router.put('/allocateCaregiver', allocateCaregiver);
router.get("/getCaregiverById/:caregiverId", getCaregiverById);
router.put('/handleinstruction', handleinstruction);
router.get("/pendingTasks", getAllPendingTasks);
router.post("/addCareGiverAndInstructions", updateCaregiverAndInstructions);
router.get("/assignedAndRejected", getAllAssignedAndRejectedTasks);
router.get("/finalizedPlans", getFinalizedPlans);

export default router;
