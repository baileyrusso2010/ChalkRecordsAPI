import { Router } from "express"
import { listSchools, getSchool } from "../controller/cte_school.controller"

const router = Router()

router.get("/", listSchools)
router.get("/:id", getSchool)

export default router
