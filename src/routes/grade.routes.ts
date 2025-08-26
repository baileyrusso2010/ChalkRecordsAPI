import { Router } from "express"
import {
    insertGrade,
    getGrade,
    deleteGrade,
    updateGrade,
    getGradebook,
    getGradebookMatrix,
} from "../controller/grade.controller"

const router = Router()

router.get("/grades/:id", getGrade)
router.post("/grades", insertGrade)
router.delete("/grades/:id", deleteGrade)
router.put("/grades/:id", updateGrade)

router.get("/gradebook/:courseId", getGradebook)
router.get("/gradebook/:courseId/matrix", getGradebookMatrix)

export default router
