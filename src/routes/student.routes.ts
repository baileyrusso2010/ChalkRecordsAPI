import { Router } from "express";
import {
  searchStudent,
  getStudent,
  getStudentsInClass,
} from "../controller/student.controller";

const router = Router();

// Search students
router.get("/students/search", searchStudent);

// Get a single student by ID
router.get("/students/:id", getStudent);

// Get all students in a specific class
router.get("/classes/:id/students", getStudentsInClass);

export default router;
