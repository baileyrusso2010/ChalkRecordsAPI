import { Router } from "express"
import {
    getStudentMemberships,
    insertStudentMembership,
    updateStudentMembership,
    getMemberships,
    updateMembership,
    deleteMembership,
    createMembership,
} from "../controller/membership.controller"

const router = Router()

// Get all memberships for a student
router.get("/student/:id/memberships", getStudentMemberships)

// Add a membership for a student
router.post("/student/:id/memberships", insertStudentMembership)

// Update a student membership
router.put("/student-membership/:id", updateStudentMembership)

// Get all memberships
router.get("/memberships", getMemberships)

// Create a membership
router.post("/memberships", createMembership)

// Update a membership
router.put("/memberships/:id", updateMembership)

// Delete a membership (cascade logic handled in controller)
router.delete("/memberships/:id", deleteMembership)

export default router
