import { Router } from "express"
import { getStudentGrades } from "../../controller/gradebook/gradebook.controller"

const router = Router()

router.get("/student-grades", getStudentGrades)

export default router
