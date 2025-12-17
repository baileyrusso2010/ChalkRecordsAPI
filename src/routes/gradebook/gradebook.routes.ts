import { Router } from "express"
import {
    getGradingCategories,
    insertGradingCategories,
    updateGradingCategories,
} from "../../controller/gradebook/gradebook.controller"

const router = Router()

router.post("/", insertGradingCategories)
router.patch("/", updateGradingCategories)
router.get("/:course_id", getGradingCategories)

export default router
