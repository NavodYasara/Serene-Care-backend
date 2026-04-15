import express from 'express';
import {
    login,
    logout,
    registerAdmin,
    registerCaretaker,
    registerCaregiver,
    userDetails,
    getCaretakerDetails,
    registerCaretakerProfile,
    updateCaretakerProfile,
    getCaretakerData,
    } from '../Controller/userController.js';

const router = express.Router();

router.post('/registerCaretaker', registerCaretaker);
router.post('/registerCaregiver', registerCaregiver);
router.post('/registerAdmin', registerAdmin);
router.post('/registerCaretaker', registerCaretakerProfile);
router.put('/updateCaretakerProfile', updateCaretakerProfile);
router.post('/login',login); // Define the route for the login controller
router.get('/userDetails', userDetails); // client makes a GET request to /userDetails,router will call the userDetails function.
router.get('/caretakerDetails', getCaretakerDetails); 
router.get('/getCaretakerData', getCaretakerData);
router.post('/logout',logout);

export default router;
