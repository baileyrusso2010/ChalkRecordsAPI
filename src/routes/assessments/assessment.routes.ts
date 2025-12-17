import { Router } from "express"
import { getStudentAssessments } from "../../controller/assessments/assessment.controller"

const router = Router()

router.get("/:student_id", getStudentAssessments)

export default router
