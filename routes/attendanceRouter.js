import { Router } from "express";
import {
  createAttendance,
  createTeacherAttendance,
  getAttendanceByDate,
  getTeacherAttendance,
} from "../controller/attendanceController.js";
import { attendanceStats } from "../controller/statsController.js";

const router = Router();

router
  .post("/students", createAttendance)
  .get("/students", getAttendanceByDate)
  .get("/stats/:id", attendanceStats);
router
  .post("/teachers", createTeacherAttendance)
  .get("/teachers", getTeacherAttendance);
export default router;
