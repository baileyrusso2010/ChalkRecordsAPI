import { Router } from "express"
import { getStudentAnswers, saveStudentForm } from "../controller/student_form.controller"

const router = Router()

//form/student/:id
router.get("/:formId/student/:studentId", getStudentAnswers)
router.post("/:formId/student/:studentId", saveStudentForm)

export default router
