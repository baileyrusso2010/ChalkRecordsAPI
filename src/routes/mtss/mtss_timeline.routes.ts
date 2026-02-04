import { Router } from "express"
import { getMTSSTimeline } from "../../controller/mtss/mtss_timeline.controller"

const router = Router()

// GET /students/:studentId/mtss-timeline
router.get("/students/:studentId/timeline", getMTSSTimeline)

export default router
