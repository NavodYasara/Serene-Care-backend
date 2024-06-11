import express from 'express';
import {
  login,
  registerCaretaker,
  userDetails,
  getCaretakerDetails,
  registerPatient,
  getCaretakerData,
} from "../Controller/userController.js";

const router = express.Router();

router.post('/registerCaretaker', registerCaretaker);
router.post('/registerPatient',registerPatient)
router.post('/login',login); // Define the route for the login controller
router.get('/userDetails', userDetails); // client makes a GET request to /userDetails,router will call the userDetails function.
router.get('/caretakerDetails', getCaretakerDetails); 
router.get('/getCaretakerData', getCaretakerData);


export default router;


