import { Router } from "express";
import {
  bulkCreateOrUpdate,
  getSkillCategory,
  getSkills,
  getStudentSkills,
  upsertSkill,
  upsertSkillScores,
} from "../controller/skill.controller";

const router = Router();

router.get("/category/:category_id", getSkills);
router.get("/category", getSkillCategory);
router.post("/", upsertSkill);
router.post("/bulk", bulkCreateOrUpdate);
router.get("/student/:category_id/:student_id", getStudentSkills);
router.post("/skillscore/bulk-upsert/:student_id", upsertSkillScores);

export default router;
