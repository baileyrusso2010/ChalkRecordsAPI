import { Router } from "express";
import { listStudents } from "../controller/student.controller";

const router = Router();

router.get("/", listStudents);

export default router;
