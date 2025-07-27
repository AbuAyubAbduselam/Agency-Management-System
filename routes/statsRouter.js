import { Router } from "express";
import {
  attendanceStats,
  numOfCandidates,
} from "../controller/statsController.js";
const router = Router();

router.route("/candidates").get(numOfCandidates);
router.route("/attendance").get(attendanceStats);

export default router;
