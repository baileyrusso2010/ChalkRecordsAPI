import { Router } from "express"
import {
    getAllCourseCatalogs,
    insertCourse,
    getAllCourses,
    getCourse,
} from "../controller/course.controller"

const router = Router()

// Course catalogs (reference data)
router.get("/course-catalogs", getAllCourseCatalogs)

// Courses collection
router.get("/courses", getAllCourses)
// Single course
router.get("/courses/:id", getCourse)
// Create course
router.post("/courses", insertCourse)

export default router
