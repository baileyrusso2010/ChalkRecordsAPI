import { Router } from "express"
import {
    listStaticFields,
    createStaticField,
    updateStaticField,
    deleteStaticField,
    saveStaticValues,
} from "../../controller/forms/form_static.controller"

const router = Router()

router.get("/form/:formId", listStaticFields) // List fields for a form
router.post("/", createStaticField) // Create new field
router.put("/:fieldId", updateStaticField) // Update field
router.delete("/:fieldId", deleteStaticField) // Delete field

router.post("/student/:studentId", saveStaticValues) // Save static field values for a student

export default router
