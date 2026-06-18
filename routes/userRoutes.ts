import express from "express";
import {
  login,
  logout,
  registerAdmin,
  registerCaretaker,
  registerCaregiver,
  userProfile,
  getCaretakerDetails,
  updateCaretakerProfile,
  getCaretakerProfile,
} from "../Controller/userController.js";

const router = express.Router();

router.post("/registerCaretaker", registerCaretaker);
router.post("/registerCaregiver", registerCaregiver);
router.post("/registerAdmin", registerAdmin);
router.put("/updateCaretakerProfile", updateCaretakerProfile);
router.post("/login", login); // Define the route for the login controller
router.get("/userProfile", userProfile); // client makes a GET request to /userProfile, router will call the userProfile function.
router.get("/caretakerDetails", getCaretakerDetails);
router.get("/getCaretakerProfile", getCaretakerProfile);
router.post("/logout", logout);

export default router;
