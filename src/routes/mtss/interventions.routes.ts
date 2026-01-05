import { Router } from "express"
import {
    createIntervention,
    listInterventions,
    getIntervention,
    updateIntervention,
    deleteIntervention,
} from "../../controller/mtss/interventions.controller"

const router = Router()

router.post("/", createIntervention)
router.get("/", listInterventions)
router.get("/:id", getIntervention)
router.put("/:id", updateIntervention)
router.delete("/:id", deleteIntervention)

export default router
