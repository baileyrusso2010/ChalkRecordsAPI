import { Router } from "express"
import { getDashboardSummary, getMetrics } from "../../controller/common/metrics.controller"
import { getBehaviorGrouping } from "../../controller/common/metrics.controller"

const router = Router()

router.post("/", getMetrics)
router.post("/behavior-incidents", getBehaviorGrouping)
router.get("/summary", getDashboardSummary)

export default router
