import { Router } from "express"
import {
    createScreening,
    listScreenings,
    getScreening,
    updateScreening,
    deleteScreening,
} from "../../controller/mtss/screenings.controller"

const router = Router()

router.post("/", createScreening)
router.get("/", listScreenings)
router.get("/:id", getScreening)
router.put("/:id", updateScreening)
router.delete("/:id", deleteScreening)

export default router
