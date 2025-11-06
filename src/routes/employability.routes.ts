import { Router } from "express"
import { employabilityUpsert, getEmployability } from "../controller/employability.controller"

const router = Router()

router.get("/", getEmployability)
router.post("/", employabilityUpsert)

export default router
