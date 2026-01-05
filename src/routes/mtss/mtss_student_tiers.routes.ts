import { Router } from "express"
import {
    createStudentTier,
    listStudentTiers,
    getStudentTier,
    updateStudentTier,
    deleteStudentTier,
} from "../../controller/mtss/mtss_student_tiers.controller"

const router = Router()

router.post("/", createStudentTier)
router.get("/", listStudentTiers)
router.get("/:id", getStudentTier)
router.put("/:id", updateStudentTier)
router.delete("/:id", deleteStudentTier)

export default router
