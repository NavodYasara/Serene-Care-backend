import express from "express";

import {
  insertRequest,
  getAllcaretakers,
  getAllRequest,
} from "../Controller/admincontroller.js";

const router = express.Router();

router.post("/insertRequest", insertRequest); // Route to insert a new request
router.get("/getAllcaretakers", getAllcaretakers); // Route to get all caretakers
router.get("/getAllRequest", getAllRequest); // Route to get all requirements
export default router;
