import { Router } from "express";
import {
  listRubricSections,
  createRubricSection,
  updateRubricSection,
  deleteRubricSection,
  createRubricRow,
  updateRubricRow,
  deleteRubricRow,
  createRubricColumn,
  updateRubricColumn,
  deleteRubricColumn,
  saveRubricGrades,
  getRubricGrades,
  listRubricRows,
  listRubricColumns,
} from "../controller/rubric.controller";
import { list } from "@sequelize/core/lib/expression-builders/list";

const router = Router();

// Sections
router.get("/sections/form/:formId", listRubricSections);
router.post("/sections", createRubricSection);
router.put("/sections/:sectionId", updateRubricSection);
router.delete("/sections/:sectionId", deleteRubricSection);

// Rows
router.get("/section/:sectionId/rows", listRubricRows);

// Columns
router.get("/section/:sectionId/columns", listRubricColumns);

// Rows
router.post("/rows", createRubricRow);
router.put("/rows/:rowId", updateRubricRow);
router.delete("/rows/:rowId", deleteRubricRow);

// Columns
router.post("/columns", createRubricColumn);
router.put("/columns/:columnId", updateRubricColumn);
router.delete("/columns/:columnId", deleteRubricColumn);

// Grades
router.get("/grades/student/:studentId/form/:formId", getRubricGrades);
router.post("/grades/student/:studentId", saveRubricGrades);

export default router;
// GET /forms → list forms
// POST /forms → create form
// GET /static-fields/form/:formId → list static fields for a form
// POST /static-fields/student/:studentId → save static field values
// GET /rubric/grades/student/:studentId/form/:formId → fetch all rubric grades for a student
// POST /rubric/grades/student/:studentId → save/update rubric grades
