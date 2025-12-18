import { Router } from "express"
import { getDashboardSummary, getMetrics, getAttendanceMetrics } from "../../controller/common/metrics.controller"
import { getBehaviorGrouping } from "../../controller/common/metrics.controller"

const router = Router()

router.post("/", getMetrics)
router.post("/behavior-incidents", getBehaviorGrouping)
router.post("/attendance-metrics", getAttendanceMetrics)
router.get("/summary", getDashboardSummary)

export default router
