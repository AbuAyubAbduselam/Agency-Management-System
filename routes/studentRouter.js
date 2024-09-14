import { Router } from "express";
import {
  validateStudentInput,
  validateIdParam,
} from "../middleware/validationMiddlware.js";
const router = Router();
import {
  getAllStudents,
  createStudent,
  getSingleStudent,
  updateStudent,
  deleteStudent,
} from "../controller/studentsController.js";
import { checkForTestUser } from "../middleware/authMiddleware.js";
import { numOfStudents } from "../controller/statsController.js";

//router.get("/", getAllStudents);
router.post("/", checkForTestUser, validateStudentInput, createStudent);

router.route("/").get(getAllStudents);

router
  .route("/:id")
  .get(getSingleStudent)
  .patch(updateStudent)
  .delete(deleteStudent);

export default router;
