import { Router } from "express"
import { getTeachers } from "../controller/users.controller"

const router = Router()

// Teachers collection
router.get("/teachers", getTeachers)

export default router
