import { Router } from "express"
import {
    createClassFormAssignment,
    listClassFormAssignments,
    getAssignmentsByClass,
    getClassFormAssignment,
    updateClassFormAssignment,
    deleteClassFormAssignment,
} from "../controller/class_form_assignment.controller"

const router = Router()

router.get("/", listClassFormAssignments) // List all assignments
router.get("/class/:classId", getAssignmentsByClass) // Get assignments by class
router.get("/:id", getClassFormAssignment) // Get single assignment
router.post("/", createClassFormAssignment) // Create new assignment
router.put("/:id", updateClassFormAssignment) // Update assignment
router.delete("/:id", deleteClassFormAssignment) // Delete assignment

export default router
