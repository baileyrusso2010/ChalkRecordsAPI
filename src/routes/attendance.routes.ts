import { Router } from "express"
import {
    createAttendance,
    getAttendance,
    updateAttendance,
    deleteAttendance,
    listAttendance,
} from "../controller/attendance.controller"

const router = Router()

router.get("/attendance", listAttendance)
router.post("/attendance", createAttendance)
router.get("/attendance/:id", getAttendance)
router.put("/attendance/:id", updateAttendance)
router.delete("/attendance/:id", deleteAttendance)

export default router
