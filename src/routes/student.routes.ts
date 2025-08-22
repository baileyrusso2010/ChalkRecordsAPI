import { Router } from "express"
import {
    getStudentsInClass,
    enrollStudent,
    removeEnrollment,
    findStudents,
    getStudent,
} from "../controller/student.controller"

const router = Router()

// List students in a specific class
router.get("/classes/:classId/students", getStudentsInClass)

// Create a new enrollment
router.post("/enrollments", enrollStudent)

// Remove an enrollment by id
router.delete("/enrollments/:id", removeEnrollment)

router.get("/students", findStudents)

router.get("/student/:id", getStudent)

export default router
