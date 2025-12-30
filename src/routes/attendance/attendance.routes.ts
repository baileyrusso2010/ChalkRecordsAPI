import { Router } from "express"
import { getAttendanceAnalytics } from "../../controller/attendance/attendance.controller"

const router = Router()

router.get("/analytics", getAttendanceAnalytics)

export default router
