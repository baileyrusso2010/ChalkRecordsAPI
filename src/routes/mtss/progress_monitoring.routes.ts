import { Router } from "express"
import {
    createProgress,
    listProgress,
    getProgress,
    updateProgress,
    deleteProgress,
} from "../../controller/mtss/progress_monitoring.controller"

const router = Router()

router.post("/", createProgress)
router.get("/", listProgress)
router.get("/:id", getProgress)
router.put("/:id", updateProgress)
router.delete("/:id", deleteProgress)

export default router
