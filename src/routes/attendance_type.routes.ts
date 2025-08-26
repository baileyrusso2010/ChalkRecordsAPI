import { Router } from "express"
import {
    createAttendanceType,
    getAttendanceType,
    listAttendanceTypes,
    updateAttendanceType,
    deleteAttendanceType,
} from "../controller/attendance_type.controller"

const router = Router()

router.get("/attendance-types", listAttendanceTypes)
router.post("/attendance-types", createAttendanceType)
router.get("/attendance-types/:id", getAttendanceType)
router.put("/attendance-types/:id", updateAttendanceType)
router.delete("/attendance-types/:id", deleteAttendanceType)

export default router
