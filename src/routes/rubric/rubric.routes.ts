import { Router } from "express"
import {
    createRubric,
    listRubrics,
    getRubric,
    createRubricEntry,
} from "../../controller/rubric/rubric.controller"

const router = Router()

router.post("/", createRubric)
router.get("/", listRubrics)
router.get("/:id", getRubric)
router.post("/:id/entries", createRubricEntry)

export default router
