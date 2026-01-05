import { Router } from "express"
import {
    createReferral,
    listReferrals,
    getReferral,
    updateReferral,
    deleteReferral,
} from "../../controller/mtss/referrals.controller"

const router = Router()

router.post("/", createReferral)
router.get("/", listReferrals)
router.get("/:id", getReferral)
router.put("/:id", updateReferral)
router.delete("/:id", deleteReferral)

export default router
