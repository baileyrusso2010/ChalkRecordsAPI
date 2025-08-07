import { Router } from "express"
import {
    insertTechnicalAssessment,
    getTechnicalAssessment,
    updateTechnicalAssessment,
    deleteTechnicalAssessment,
} from "../controller/performance_assessment.controller"

const router = Router()

router.post("/performance-assessment", insertTechnicalAssessment)
router.get("/performance-assessment/:studentId", getTechnicalAssessment)
router.put("/performance-assessment/:studentId", updateTechnicalAssessment)
router.delete("/performance-assessment/:studentId", deleteTechnicalAssessment)

export default router
