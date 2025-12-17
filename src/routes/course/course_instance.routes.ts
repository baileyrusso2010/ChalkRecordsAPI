import { Router } from "express"
import {
    listCourseInstances,
    getCourseInstance,
    createCourseInstance,
    updateCourseInstance,
    deleteCourseInstance,
    getCourseStats,
} from "../../controller/course/course_instance.controller"

const router = Router()

router.get("/", listCourseInstances)
router.get("/:id", getCourseInstance)
router.post("/", createCourseInstance)
router.put("/:id", updateCourseInstance)
router.delete("/:id", deleteCourseInstance)

router.get("/:id/stats", getCourseStats)

export default router
