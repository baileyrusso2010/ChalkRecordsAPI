import { Router } from "express"
import {
    createRubric,
    listRubrics,
    getRubric,
    createRubricEntry,
    upsertRubricEntry,
} from "../../controller/rubric/rubric.controller"

const router = Router()

router.post("/", createRubric)
router.get("/", listRubrics)
router.get("/:id", getRubric)
router.post("/:id/entries", createRubricEntry)
router.put("/:id/entries", upsertRubricEntry)

export default router
