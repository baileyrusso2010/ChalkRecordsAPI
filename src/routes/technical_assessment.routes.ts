import { Router } from "express"
import {
    insertTechnicalAssessment,
    getTechnicalAssessment,
    updateTechnicalAssessment,
    deleteTechnicalAssessment,
} from "../controller/technical_assessment.controller"

const router = Router()

router.post("/technical-assessment", insertTechnicalAssessment)
router.get("/technical-assessment/:studentId", getTechnicalAssessment)
router.put("/technical-assessment/:studentId", updateTechnicalAssessment)
router.delete("/technical-assessment/:studentId", deleteTechnicalAssessment)

export default router
