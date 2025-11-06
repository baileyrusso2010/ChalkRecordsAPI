import { Router } from "express"
import {
    bulkCreateOrUpdate,
    getSkills,
    getStudentSkills,
    upsertSkill,
    upsertSkillScores,
} from "../controller/skill.controller"

const router = Router()

router.get("/category/:category_id", getSkills)
router.post("/", upsertSkill)
router.post("/bulk", bulkCreateOrUpdate)
router.get("/student/:category_id", getStudentSkills)
router.post("/skillscore/bulk-upsert", upsertSkillScores)

export default router
