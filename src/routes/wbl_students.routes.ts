import { Router } from "express"
import {
    listWblStudents,
    getWblStudent,
    createWblStudent,
    updateWblStudent,
    deleteWblStudent,
} from "../controller/wbl_students.controller"

import {
    createDeployment,
    getDeployment,
    updateHours,
} from "../controller/wbl_deployment.controller"

const router = Router()

router.get("/", listWblStudents)
router.get("/:id", getWblStudent)
router.post("/", createWblStudent)
router.put("/:id", updateWblStudent)
router.delete("/:id", deleteWblStudent)

router.get("/deployment/:token", getDeployment)
router.post("/deployment", createDeployment)
router.post("/deployment/hours", updateHours)

export default router
