import { Router } from "express"
import { getMetrics } from "../controller/metrics.controller"

const router = Router()

router.post("/", getMetrics)

export default router
