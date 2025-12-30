import { Router } from "express";
import {
  getAllBehaviors,
  getBehaviorById,
  getBehaviorsByStudentId,
  getBehaviorAnalytics,
} from "../../controller/behavior/behavior.controller";

const router = Router();

router.get("/", getAllBehaviors);
router.get("/analytics", getBehaviorAnalytics);
router.get("/student/:studentId", getBehaviorsByStudentId);
router.get("/:id", getBehaviorById);

export default router;
