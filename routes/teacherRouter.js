import { Router } from "express";
import {
  validateCandidateInput,
  validateIdParam,
} from "../middleware/validationMiddlware.js";
const router = Router();
import {
  getAllTeachers,
  createTeacher,
  getSingleTeacher,
  updateTeacher,
  deleteTeacher,
  showStats,
} from "../controller/teachersController.js";

//router.get("/", getAllCandidates);
router.post("/", createTeacher);

router.route("/").get(getAllTeachers);

router.route("/stats").get(showStats);

router
  .route("/:id")
  .get(getSingleTeacher)
  .patch(validateIdParam, validateCandidateInput, updateTeacher)
  .delete(validateIdParam, deleteTeacher);

export default router;
