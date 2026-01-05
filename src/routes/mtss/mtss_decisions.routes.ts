import { Router } from "express"
import {
    createDecision,
    listDecisions,
    getDecision,
    updateDecision,
    deleteDecision,
} from "../../controller/mtss/mtss_decisions.controller"

const router = Router()

router.post("/", createDecision)
router.get("/", listDecisions)
router.get("/:id", getDecision)
router.put("/:id", updateDecision)
router.delete("/:id", deleteDecision)

export default router
