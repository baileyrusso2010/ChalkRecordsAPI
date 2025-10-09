import { Router } from "express"
import {
    listCourseInstances,
    getCourseInstance,
    createCourseInstance,
    updateCourseInstance,
    deleteCourseInstance,
} from "../controller/course_instance.controller"

const router = Router()

router.get("/", listCourseInstances)
router.get("/:id", getCourseInstance)
router.post("/", createCourseInstance)
router.put("/:id", updateCourseInstance)
router.delete("/:id", deleteCourseInstance)

export default router
