import { Router } from "express"
import {
    getFlags,
    createFlag,
    editFlag,
    deleteFlag,
    getStudentFlags,
    createStudentFlag,
    editStudentFlag,
    deleteStudentFlag,
} from "../controller/flag.controller"

const router = Router()

// Retrieve all flags
router.get("/flags", getFlags)

// Create a new flag
router.post("/flags", createFlag)

// Update a flag
router.put("/flags/:id", editFlag)

// Delete a flag
router.delete("/flags/:id", deleteFlag)

// Student flag participation CRUD
router.get("/student-flags/:studentId", getStudentFlags)
router.post("/student-flags", createStudentFlag)
router.put("/student-flags/:id", editStudentFlag)
router.delete("/student-flags/:id", deleteStudentFlag)

export default router
