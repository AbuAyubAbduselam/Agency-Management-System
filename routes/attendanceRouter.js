import { Router } from "express";
import {
  createAttendance,
  createTeacherAttendance,
  getAttendance,
  getTeacherAttendance,
} from "../controller/attendanceController.js";

const router = Router();

router.post("/students", createAttendance).get("/students", getAttendance);
router
  .post("/teachers", createTeacherAttendance)
  .get("/teachers", getTeacherAttendance);
export default router;
