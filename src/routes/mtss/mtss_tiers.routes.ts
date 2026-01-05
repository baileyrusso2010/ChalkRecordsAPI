import { Router } from "express"
import {
    createTier,
    listTiers,
    getTier,
    updateTier,
    deleteTier,
} from "../../controller/mtss/mtss_tiers.controller"

const router = Router()

router.post("/", createTier)
router.get("/", listTiers)
router.get("/:id", getTier)
router.put("/:id", updateTier)
router.delete("/:id", deleteTier)

export default router
