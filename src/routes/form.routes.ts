import { Router } from "express";
import {
  createForm,
  getForms,
  getFormById,
  updateForm,
  deleteForm,
} from "../controller/form.controller";
import {
  assignForms,
  getStudentForms,
} from "../controller/student_form.controller";

const router = Router();

router.post("/", createForm);
router.get("/", getForms);
router.get("/:id", getFormById);
router.put("/:id", updateForm);
router.delete("/:id", deleteForm);
router.post("/assign", assignForms);
router.get("/student/:studentId", getStudentForms);

export default router;
