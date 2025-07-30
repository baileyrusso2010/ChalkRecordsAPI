import { Router } from "express"
import { getCTESchoolSummary, getAllCTESchools } from "../controller/cte_school.controller"

const router = Router()

router.get("/cte-school/:id/summary", getCTESchoolSummary)
router.get("/cte-schools", getAllCTESchools)

export default router
