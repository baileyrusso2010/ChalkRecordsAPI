import { Router } from "express"
import {
    listForms,
    getForm,
    createForm,
    updateForm,
    deleteForm,
    getFormWithGrades,
    getFormsByCourse,
} from "../controller/form.controller"
import { assignForms, getStudentForms } from "../controller/student_form.controller"

const router = Router()

router.get("/", listForms) // List all forms
router.get("/:formId/full", getFormWithGrades) // Get form with full structure and grades
router.get("/:formId", getForm) // Get single form
router.post("/", createForm) // Create new form
router.put("/:formId", updateForm) // Update form
router.delete("/:formId", deleteForm) // Delete form

router.get("/course/:courseId", getFormsByCourse) // Get forms by course
router.post("/assign", assignForms) // Assign forms to students
router.get("/student/:studentId", getStudentForms) // Get forms for a student

export default router
