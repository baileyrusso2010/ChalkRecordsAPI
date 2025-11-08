import { Router } from "express";
import {
  listStudents,
  getStudents,
  getStudent,
} from "../controller/student.controller";

const router = Router();

router.get("/advanced", listStudents);
router.get("/", getStudents);
router.get("/:id", getStudent);

export default router;
