import { Router } from "express"
import {
    listStudents,
    getStudents,
    getStudent,
    getStudentDetail,
    searchStudents,
} from "../../controller/student/student.controller"

const router = Router()

router.get("/advanced", listStudents)
router.get("/search", searchStudents)
router.get("/detail/:id", getStudentDetail)
router.get("/", getStudents)
router.get("/:id", getStudent)

export default router
