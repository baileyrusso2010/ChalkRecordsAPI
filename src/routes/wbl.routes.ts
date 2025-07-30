import { Router } from "express"
import {
    deleteWBLType,
    getWBLTypes,
    updateWBLType,
    createWBLTypes,
    insertStudentWBLHours,
    updateStudentWBLHours,
    deleteStudentWBLHours,
    getStudentWBLHours,
} from "../controller/wbl_hours.controller"

const router = Router()

router.post("/wbl-types", createWBLTypes)
router.get("/wbl-types", getWBLTypes)
router.put("/wbl-types/:id", updateWBLType)
router.delete("/wbl-types/:id", deleteWBLType)

router.post("/student-wbl-hours", insertStudentWBLHours)
router.get("/student-wbl-hours/:student_id", getStudentWBLHours)
router.put("/student-wbl-hours/:id", updateStudentWBLHours)
router.delete("/student-wbl-hours/:id", deleteStudentWBLHours)

export default router
