import { Router } from "express"
import { getMetrics } from "../../controller/common/metrics.controller"

const router = Router()

router.post("/", getMetrics)

export default router
