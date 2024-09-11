import { Router } from "express";
import {
  createAttendance,
  createTeacherAttendance,
  getAttendanceByDate,
  getTeacherAttendance,
} from "../controller/attendanceController.js";

const router = Router();

router
  .post("/students", createAttendance)
  .get("/students", getAttendanceByDate);
router
  .post("/teachers", createTeacherAttendance)
  .get("/teachers", getTeacherAttendance);
export default router;
