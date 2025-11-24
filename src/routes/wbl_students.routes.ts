import { Router } from "express";
import {
  listWblStudents,
  getWblStudent,
  createWblStudent,
  updateWblStudent,
  deleteWblStudent,
} from "../controller/wbl_students.controller";

const router = Router();

router.get("/", listWblStudents);
router.get("/:id", getWblStudent);
router.post("/", createWblStudent);
router.put("/:id", updateWblStudent);
router.delete("/:id", deleteWblStudent);

export default router;
