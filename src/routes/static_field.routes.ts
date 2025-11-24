import { Router } from "express";
import {
  listStaticFields,
  createStaticField,
  updateStaticField,
  deleteStaticField,
  saveStaticValues,
  seedStaticFields,
} from "../controller/form_static.controller";

const router = Router();

router.get("/form/:formId", listStaticFields); // List fields for a form
router.post("/", createStaticField); // Create new field
router.post("/seed", seedStaticFields); // Seed sample fields
router.put("/:fieldId", updateStaticField); // Update field
router.delete("/:fieldId", deleteStaticField); // Delete field

router.post("/student/:studentId", saveStaticValues); // Save static field values for a student

export default router;
