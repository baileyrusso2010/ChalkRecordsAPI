import { Router } from "express";
import {
  getClassWithStudentCount,
  getClassFlagCount,
} from "../controller/flag.controller";

const router = Router();

// Get class info with total student count
router.get("/classes/:id/summary", getClassWithStudentCount);

// Get number of students in a class with a specific flag
router.get("/classes/:id/flags/:flagId/count", getClassFlagCount);

export default router;
