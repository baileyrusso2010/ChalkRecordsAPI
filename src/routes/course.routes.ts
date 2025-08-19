import { Router } from "express"
import { getAllCourseCatalogs, insertCourses } from "../controller/course.controller"

const router = Router()

router.get("/course-catalogs", getAllCourseCatalogs)
router.post("/courses", insertCourses)

export default router
