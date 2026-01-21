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

export default router
