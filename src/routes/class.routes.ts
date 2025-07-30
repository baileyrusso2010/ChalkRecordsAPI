import { Router } from "express"
import { getAllClasses } from "../controller/class.controller"

import { getClassWithStudentCount, getClassFlagCount } from "../controller/flag.controller"
const router = Router()

// Get all classes
router.get("/classes", getAllClasses)
router.get("/classes/:id/summary", getClassWithStudentCount)

// Get number of students in a class with a specific flag
router.get("/classes/:id/flags/:flagId/count", getClassFlagCount)

export default router
