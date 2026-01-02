import { Router } from "express"
import {
    listForms,
    getForm,
    createForm,
    updateForm,
    deleteForm,
    createClassForm,
    getClassForms,
    createStudentFormSubmission,
    getStudentFormSubmission,
    insertStudentFormSubmissionData,
} from "../../controller/forms/form.controller"
import { assignForms, getStudentForms } from "../../controller/forms/student_form.controller"

const router = Router()

router.get("/", listForms) // List all forms
router.post("/", createForm) // Create new form
// Specific routes MUST come before generic parameterized routes
router.post("/assign", assignForms) // Assign forms to students
router.get("/student/:studentId", getStudentForms) // Get forms for a student

router.post("/class", createClassForm) // Create new class form
router.get("/class", getClassForms) // Get all class forms

router.get("/:formId", getForm) // Get single form
router.put("/:formId", updateForm) // Update form
router.delete("/:formId", deleteForm) // Delete form

// Submission routes
router.get("/submission/:formId/:studentId", getStudentFormSubmission) // Get student form submission
router.post("/submission", createStudentFormSubmission) // Create new student form submission
router.post("/submission/:submissionId", insertStudentFormSubmissionData) // Upsert student form submission data

export default router
