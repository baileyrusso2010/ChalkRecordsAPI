import { Router } from "express"
import { getSkills, upsertSkill } from "../controller/skill.controller"

const router = Router()

router.get("/category/:category_id", getSkills)
router.post("/", upsertSkill)

export default router
