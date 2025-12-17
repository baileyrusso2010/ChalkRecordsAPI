import { Router } from "express"
import { getTeachersByProgram } from "../../controller/staff/staff.controller"

const router = Router()

router.get("/:id", getTeachersByProgram)

export default router
