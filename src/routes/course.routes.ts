import { Router } from "express"
import { getAllCourseCatalogs, insertCourse, getAllCourses } from "../controller/course.controller"

const router = Router()

router.get("/course-catalogs", getAllCourseCatalogs)
router.get("/courses", getAllCourses)
router.post("/courses", insertCourse)

export default router
