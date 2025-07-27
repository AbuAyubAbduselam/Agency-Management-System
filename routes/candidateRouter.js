import { Router } from "express";
import {
  validateCandidateInput,
  validateIdParam,
} from "../middleware/validationMiddlware.js";
const router = Router();
import {
  getAllCandidates,
  createCandidate,
  getSingleCandidate,
  updateCandidate,
  deleteCandidate,
  getCheckedCandidates,
} from "../controller/candidatesController.js";

import { checkForTestUser } from "../middleware/authMiddleware.js";
import { getAllSelectedCandidates } from "../controller/attendanceController.js";

//router.get("/", getAllCandidates);
router.post("/", checkForTestUser, validateCandidateInput, createCandidate);

router.route("/").get(getAllCandidates);

router.route("/checked").get(getCheckedCandidates);

router
  .route("/:id")
  .get(getSingleCandidate)
  .patch(updateCandidate)
  .delete(deleteCandidate);

export default router;
