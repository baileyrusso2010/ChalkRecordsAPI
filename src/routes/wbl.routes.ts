import { Router } from "express"
import { addWBLType, removeWBLType, editWBLType, getWBLTypes } from "../controller/wbl.controller"
import {
    updateStudentWBLHours,
    insertStudentWBLHours,
    deleteStudentWBLHours,
    getStudentWBLHours,
} from "../controller/wbl.controller"

const router = Router()

router.get("/wbl/types", getWBLTypes)
router.delete("/wbl/types/:id", removeWBLType)
router.post("/wbl/types", addWBLType)
router.put("/wbl/types/:id", editWBLType)

router.get("/wbl/hours/:studentId", getStudentWBLHours)
router.post("/wbl/hours", insertStudentWBLHours)
router.put("/wbl/hours/:id", updateStudentWBLHours)
router.delete("/wbl/hours/:id", deleteStudentWBLHours)

export default router
