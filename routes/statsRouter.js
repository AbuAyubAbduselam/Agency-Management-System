import { Router } from "express";
import {
  attendanceStats,
  numOfStudents,
} from "../controller/statsController.js";
const router = Router();

router.route("/students").get(numOfStudents);
router.route("/attendance").get(attendanceStats);

export default router;
