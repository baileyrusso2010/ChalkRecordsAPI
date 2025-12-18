import { Router } from "express"
import { listSchools, getSchool } from "../../controller/school/school.controller"

const router = Router()

router.get("/", listSchools)
router.get("/:id", getSchool)

export default router
