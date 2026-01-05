import { Router } from "express"
import {
    createStudentIntervention,
    listStudentInterventions,
    getStudentIntervention,
    updateStudentIntervention,
    deleteStudentIntervention,
} from "../../controller/mtss/student_interventions.controller"

const router = Router()

router.post("/", createStudentIntervention)
router.get("/", listStudentInterventions)
router.get("/:id", getStudentIntervention)
router.put("/:id", updateStudentIntervention)
router.delete("/:id", deleteStudentIntervention)

export default router
