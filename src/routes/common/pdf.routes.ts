import { Router } from "express"
import { generateStudentSkillsPdf } from "../../controller/common/pdf.controller"

const router = Router()

// GET /api/pdf/student/:studentId/category/:categoryId
router.get("/student/:studentId/category/:categoryId", generateStudentSkillsPdf)

export default router
