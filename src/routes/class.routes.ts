import { Router } from "express";
import { getAllClasses } from "../controller/class.controller";

const router = Router();

// Get all classes
router.get("/classes", getAllClasses);

export default router;
