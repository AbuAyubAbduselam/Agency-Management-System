import { Router } from "express";
import {
  getAllSelectedCandidates
} from "../controller/attendanceController.js";
import { attendanceStats } from "../controller/statsController.js";

const router = Router();

router
  .get("/selected", getAllSelectedCandidates)
  .get("/stats/:id", attendanceStats);

export default router;
