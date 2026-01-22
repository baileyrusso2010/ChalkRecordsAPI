import { Router } from "express"
import {
    getEvaluationForm,
    createEvaluationForm,
    updateEvaluationForm,
    deleteEvaluationForm,
    bulkUpsertEvaluationCells,
    getEvaluationSections,
    createEvaluationSection,
    updateEvaluationSection,
    deleteEvaluationSection,
    getEvaluationSectionRows,
    updateEvaluationSectionRow,
    createEvaluationSectionRow,
    deleteEvaluationSectionRow,
    getEvaluationSectionColumns,
    createEvaluationSectionColumn,
    updateEvaluationSectionColumn,
    deleteEvaluationSectionColumn,
} from "../../controller/forms/form.controller"

import {
    createTemplateForm,
    getTemplates,
    getTemplate,
    createTemplateSection,
    getTemplateSections,
    createRow,
    getTemplateRows,
    createColumn,
    getTemplateColumns,
} from "../../controller/forms/template_form.controller"

const router = Router()

//documents
router.get("/:id", getEvaluationForm)
router.post("/:classId", createEvaluationForm)
router.put("/:id", updateEvaluationForm)
router.delete("/:id", deleteEvaluationForm)

//sections
router.get("/:documentId/sections", getEvaluationSections)
router.post("/:documentId/sections", createEvaluationSection)
router.put("/:documentId/sections/:sectionId", updateEvaluationSection)
router.delete("/:documentId/sections/:sectionId", deleteEvaluationSection)

//rows
router.get("/:documentId/sections/:sectionId/rows", getEvaluationSectionRows)
router.post("/:documentId/sections/:sectionId/rows", createEvaluationSectionRow)
router.put("/:documentId/sections/:sectionId/rows/:rowId", updateEvaluationSectionRow)
router.delete("/:documentId/sections/:sectionId/rows/:rowId", deleteEvaluationSectionRow)

//columns
router.get("/:documentId/sections/:sectionId/columns", getEvaluationSectionColumns)
router.post("/:documentId/sections/:sectionId/columns", createEvaluationSectionColumn)
router.put("/:documentId/sections/:sectionId/columns/:columnId", updateEvaluationSectionColumn)
router.delete("/:documentId/sections/:sectionId/columns/:columnId", deleteEvaluationSectionColumn)

//cells
router.post("/:documentId/cells", bulkUpsertEvaluationCells)

//TEMPLATES

//documents
router.get("/templates", getTemplates)
router.post("/templates", createTemplateForm)
router.get("/templates/:id", getTemplate)

//sections
router.get("/templates/:templateId/sections", getTemplateSections)
router.post("/templates/:templateId/sections", createTemplateSection)

//rows
router.get("/templates/:templateId/sections/:sectionId/rows", getTemplateRows)
router.post("/templates/:templateId/sections/:sectionId/rows", createRow)

//columns
router.get("/templates/:templateId/sections/:sectionId/columns", getTemplateColumns)
router.post("/templates/:templateId/sections/:sectionId/columns", createColumn)

export default router
