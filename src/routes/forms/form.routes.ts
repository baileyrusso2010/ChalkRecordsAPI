import { Router } from "express"
import {
    listForms,
    getForm,
    createForm,
    updateForm,
    deleteForm,
    getFormWithGrades,
    getFormsByCourse,
    getSectionFormGrades,
    getFormsWithGradesForSection,
} from "../../controller/forms/form.controller"
import {
    assignForms,
    getStudentForms,
    assignFormToCourse,
} from "../../controller/forms/student_form.controller"

const router = Router()

router.get("/", listForms) // List all forms
router.get("/section-grades", getFormsWithGradesForSection) // Get all forms with grades for a section
router.get("/:formId/full", getFormWithGrades) // Get form with full structure and grades
router.get("/:formId/section-grades", getSectionFormGrades) // Get form with grades filtered by section and period
router.get("/:formId", getForm) // Get single form
router.post("/", createForm) // Create new form
router.put("/:formId", updateForm) // Update form
router.delete("/:formId", deleteForm) // Delete form

router.get("/course/:courseId", getFormsByCourse) // Get forms by course
router.post("/assign", assignForms) // Assign forms to students
router.post("/assign/course", assignFormToCourse) // Assign form to course
router.get("/student/:studentId", getStudentForms) // Get forms for a student

export default router
