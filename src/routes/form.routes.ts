import { Router } from "express";
import {
  listForms,
  getForm,
  createForm,
  updateForm,
  deleteForm,
} from "../controller/form.controller";

const router = Router();

router.get("/", listForms); // List all forms
router.get("/:formId", getForm); // Get single form
router.post("/", createForm); // Create new form
router.put("/:formId", updateForm); // Update form
router.delete("/:formId", deleteForm); // Delete form

export default router;
