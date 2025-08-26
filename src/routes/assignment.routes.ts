import { Router } from "express"
import {
    insertAssingment,
    getAssignment,
    deleteAssignment,
    updateAssignment,
    getAllAssignments,
} from "../controller/assignment.controller"

const router = Router()

router.get("/assignments/:id", getAssignment)
router.delete("/assignments/:id", deleteAssignment)
router.post("/assignments", insertAssingment)
router.put("/assignments/:id", updateAssignment)

//get all assignmetns for class
router.get("/assignments/course/:courseId", getAllAssignments)

export default router
