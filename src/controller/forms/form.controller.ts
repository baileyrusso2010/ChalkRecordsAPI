import { Request, Response } from "express"
import { Evaluation_Document } from "../../models/forms/evaluation_document.model"
import { Evaluation_Section } from "../../models/forms/evaluation_sections.model"
import { Evaluation_Section_Rows } from "../../models/forms/evaluation_section_rows.model"
import { Evaluation_Section_Columns } from "../../models/forms/evaluation_section_columns.model"

import { Evaluation_Cells } from "../../models/forms/evaluation_cells.model"
import { WBL_Hours } from "../../models/wbl/wbl_hours.model"
import { WBL_Catagories } from "../../models/wbl/wbl_catagories.model"
import { Rubric } from "../../models/rubric/rubric.model"
import { Rubric_Levels } from "../../models/rubric/rubric_levels.model"
import { Student } from "../../models/student.model"
import { Form_Template } from "../../models/forms/template/form_template.model"
import { Template_Section } from "../../models/forms/template/template_section.model"
import { Template_Row } from "../../models/forms/template/template_row.model"
import { Template_Column } from "../../models/forms/template/template_column.model"
import sequelize from "../../database"

export const getAllEvaluationForms = async (req: Request, res: Response) => {
    try {
        const forms = await Evaluation_Document.findAll()
        res.status(200).json(forms)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Error fetching evaluation forms" })
    }
}

export const getEvaluationFormsByClass = async (req: Request, res: Response) => {
    try {
        const { classId } = req.params

        const forms = await Evaluation_Document.findAll({
            where: {
                class_id: classId,
            },
        })

        res.status(200).json(forms)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Error fetching evaluation forms" })
    }
}

export const getEvaluationForm = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        /** 1️⃣ Load form + schema */
        const form = await Evaluation_Document.findByPk(id, {
            include: [
                {
                    model: Evaluation_Section,
                    as: "sections",
                    include: [
                        { model: Evaluation_Section_Rows, as: "rows" },
                        { model: Evaluation_Section_Columns, as: "columns" },
                    ],
                },
                {
                    model: Rubric,
                    as: "rubric",
                    include: [{ model: Rubric_Levels, as: "rubric_levels" }],
                },
            ],
        })

        if (!form) {
            return res.status(404).json({ error: "Form not found" })
        }

        /** 2️⃣ Load cells */
        const cells = await Evaluation_Cells.findAll({
            where: { document_id: id },
        })

        /** 3️⃣ Build lookup maps (ID → key) */
        const sectionById = new Map<number, any>()
        const rowById = new Map<number, any>()
        const columnById = new Map<number, any>()

        form.sections?.forEach((section: any) => {
            sectionById.set(section.id, section)
            section.rows.forEach((row: any) => rowById.set(row.id, row))
            section.columns.forEach((col: any) => columnById.set(col.id, col))
        })

        /** 4️⃣ Shape form (keys only) */
        const shapedForm = {
            id: form.id,
            class_id: form.class_id,
            name: form.name,
            rubric_id: form.rubric_id,
            rubric: form.rubric
                ? {
                      id: form.rubric.id,
                      name: form.rubric.name,
                      description: form.rubric.description,
                      levels:
                          form.rubric.rubric_levels
                              ?.map((level: any) => ({
                                  id: level.id,
                                  value: level.value,
                                  label: level.label,
                                  description: level.description,
                                  sort_order: level.sort_order,
                              }))
                              .sort((a: any, b: any) => a.sort_order - b.sort_order) || [],
                  }
                : null,
            sections: await Promise.all(
                form.sections?.map(async (section: any) => {
                    let rows = section.rows.map((row: any) => ({
                        key: row.key,
                        id: row.id,
                        label: row.label,
                        description: row.description,
                        row_type: row.row_type,
                    }))

                    // LINKED DATA LOGIC
                    if (
                        section.section_type === "linked" &&
                        (section.source_table === "wbl_hours" || section.source_table === "WBL")
                    ) {
                        const studentId = req.query.student_id ? Number(req.query.student_id) : null
                        if (studentId) {
                            const wblEntries = await WBL_Hours.findAll({
                                where: { student_id: studentId },
                                include: [{ model: WBL_Catagories, as: "category" }],
                                order: [["date", "DESC"]],
                            })

                            rows = wblEntries.map((entry: any) => ({
                                key: `wbl_${entry.id}`,
                                id: entry.id,
                                label: entry.date,
                                description: entry.comments,
                                row_type: "linked",
                                original_data: entry,
                            }))
                        }

                        // For WBL linked sections, use predefined columns that match WBL_Hours fields
                        // This ensures proper data mapping in the cell injection logic
                        return {
                            id: section.id,
                            key: section.key,
                            label: section.label,
                            section_type: section.section_type,
                            source_table: section.source_table,
                            rows: rows,
                            columns: [
                                {
                                    key: "date",
                                    id: "wbl_date",
                                    label: "Date",
                                    valueType: "text",
                                    config: { editable: false },
                                },
                                {
                                    key: "category",
                                    id: "wbl_category",
                                    label: "Category",
                                    valueType: "text",
                                    config: { editable: false },
                                },
                                {
                                    key: "hours",
                                    id: "wbl_hours",
                                    label: "Hours",
                                    valueType: "number",
                                    config: { editable: false },
                                },
                                {
                                    key: "comments",
                                    id: "wbl_comments",
                                    label: "Comments",
                                    valueType: "text",
                                    config: { editable: false },
                                },
                            ],
                        }
                    }

                    return {
                        id: section.id,
                        key: section.key,
                        label: section.label,
                        section_type: section.section_type,
                        source_table: section.source_table,
                        uses_rubric: section.uses_rubric || false,
                        rows: rows,
                        columns: section.columns.map((col: any) => ({
                            key: col.key,
                            id: col.id,
                            label: col.label,
                            valueType: col.value_type,
                            config: col.config,
                        })),
                    }
                }) || [],
            ),
        }

        /** 5️⃣ Shape cells → key-based */
        const shapedCells: Record<string, any> = {}

        // Handle Linked Data Injection into Cells
        if (req.query.student_id) {
            const studentId = String(req.query.student_id)
            for (const section of shapedForm.sections) {
                if (
                    section.section_type === "linked" &&
                    (section.source_table === "wbl_hours" || section.source_table === "WBL")
                ) {
                    // @ts-ignore
                    for (const row of section.rows) {
                        // @ts-ignore
                        const entry = row.original_data
                        if (!entry) continue

                        shapedCells[studentId] ??= {}
                        shapedCells[studentId][section.key] ??= {}
                        shapedCells[studentId][section.key][row.key] ??= {}

                        // Map columns
                        section.columns.forEach((col: any) => {
                            let value = null
                            if (col.key === "date") value = entry.date
                            if (col.key === "hours") value = entry.hours
                            if (col.key === "comments") value = entry.comments
                            if (col.key === "category") value = entry.category?.name

                            shapedCells[studentId][section.key][row.key][col.key] = value
                        })
                    }
                }
            }
        }

        for (const cell of cells) {
            const section = sectionById.get(cell.section_id)
            const row = rowById.get(cell.row_id)
            const col = columnById.get(cell.column_id)

            if (!section || !row || !col) continue

            const studentKey = String(cell.student_id)

            shapedCells[studentKey] ??= {}
            shapedCells[studentKey][section.key] ??= {}
            shapedCells[studentKey][section.key][row.key] ??= {}

            let value: any = null
            if (col.value_type === "number") value = cell.value_number
            if (col.value_type === "boolean") value = cell.value_boolean
            if (col.value_type === "text") value = cell.value_text

            shapedCells[studentKey][section.key][row.key][col.key] = value
        }

        /** 6️⃣ Final response */
        res.json({
            form: shapedForm,
            cells: shapedCells,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Error fetching evaluation form" })
    }
}

export const createEvaluationForm = async (req: Request, res: Response) => {
    try {
        const { classId } = req.params

        const form = await Evaluation_Document.create({
            class_id: classId,
            name: req.body.name,
        })

        res.status(200).json(form)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Error creating evaluation form" })
    }
}

export const updateEvaluationForm = async (req: Request, res: Response) => {}

export const deleteEvaluationForm = async (req: Request, res: Response) => {}

export const createEvaluationSection = async (req: Request, res: Response) => {
    try {
        const { documentId } = req.params

        const section = await Evaluation_Section.create({
            document_id: documentId,
            key: req.body.label.toLowerCase().replace(/\s/g, "_"),
            label: req.body.label,
            section_type: req.body.section_type,
            source_table: req.body.source_table,
        })

        res.status(200).json(section)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Error creating evaluation section" })
    }
}

export const getEvaluationSections = async (req: Request, res: Response) => {
    try {
        const { documentId } = req.params

        const sections = await Evaluation_Section.findAll({
            where: {
                document_id: documentId,
            },
        })

        res.status(200).json(sections)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Error fetching evaluation sections" })
    }
}

export const updateEvaluationSection = async (req: Request, res: Response) => {
    try {
        const { sectionId } = req.params

        const section = await Evaluation_Section.findByPk(sectionId)

        if (!section) {
            return res.status(404).json({ error: "Evaluation section not found" })
        }

        // Update fields if provided
        if (req.body.key !== undefined) section.key = req.body.key
        if (req.body.label !== undefined) section.label = req.body.label
        if (req.body.uses_rubric !== undefined) section.uses_rubric = req.body.uses_rubric
        if (req.body.section_type !== undefined) section.section_type = req.body.section_type
        if (req.body.source_table !== undefined) section.source_table = req.body.source_table

        await section.save()

        res.status(200).json(section)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Error updating evaluation section" })
    }
}

export const deleteEvaluationSection = async (req: Request, res: Response) => {
    try {
        const { sectionId } = req.params

        const section = await Evaluation_Section.findByPk(sectionId)

        if (!section) {
            return res.status(404).json({ error: "Evaluation section not found" })
        }

        await section.destroy()

        res.status(200).json({ message: "Evaluation section deleted" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Error deleting evaluation section" })
    }
}

export const createEvaluationSectionRow = async (req: Request, res: Response) => {
    try {
        const { sectionId } = req.params

        const section = await Evaluation_Section.findByPk(sectionId)

        if (!section) {
            return res.status(404).json({ error: "Evaluation section not found" })
        }

        const row = await Evaluation_Section_Rows.create({
            section_id: sectionId,
            key: req.body.key,
            label: req.body.label,
            description: req.body.description,
            row_type: req.body.row_type,
        })

        res.status(200).json(row)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Error creating evaluation section row" })
    }
}

export const updateEvaluationSectionRow = async (req: Request, res: Response) => {
    try {
        const { sectionId, rowId } = req.params

        const row = await Evaluation_Section_Rows.findByPk(rowId)

        if (!row) {
            return res.status(404).json({ error: "Evaluation section row not found" })
        }

        //update key and label
        row.key = req.body.key
        row.label = req.body.label
        row.description = req.body.description
        row.row_type = req.body.row_type

        await row.save()

        res.status(200).json(row)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Error updating evaluation section row" })
    }
}

export const getEvaluationSectionRows = async (req: Request, res: Response) => {
    try {
        const { sectionId } = req.params

        const rows = await Evaluation_Section_Rows.findAll({
            where: {
                section_id: sectionId,
            },
        })

        res.status(200).json(rows)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Error fetching evaluation section rows" })
    }
}

export const deleteEvaluationSectionRow = async (req: Request, res: Response) => {
    try {
        const { rowId } = req.params

        const row = await Evaluation_Section_Rows.findByPk(rowId)

        if (!row) {
            return res.status(404).json({ error: "Evaluation section row not found" })
        }

        await row.destroy()

        res.status(200).json({ message: "Evaluation section row deleted" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Error deleting evaluation section row" })
    }
}

//column

export const createEvaluationSectionColumn = async (req: Request, res: Response) => {
    try {
        const { sectionId } = req.params

        const column = await Evaluation_Section_Columns.create({
            section_id: sectionId,
            key: req.body.key,
            label: req.body.label,
            value_type: req.body.value_type,
            config: req.body.config,
        })

        res.status(200).json(column)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Error creating evaluation section column" })
    }
}

export const updateEvaluationSectionColumn = async (req: Request, res: Response) => {
    try {
        const { columnId } = req.params

        const column = await Evaluation_Section_Columns.findByPk(columnId)

        if (!column) {
            return res.status(404).json({ error: "Evaluation section column not found" })
        }

        //update key and label
        column.key = req.body.key
        column.label = req.body.label
        column.value_type = req.body.value_type
        column.config = req.body.config

        await column.save()

        res.status(200).json(column)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Error updating evaluation section column" })
    }
}

export const deleteEvaluationSectionColumn = async (req: Request, res: Response) => {
    try {
        const { columnId } = req.params

        const column = await Evaluation_Section_Columns.findByPk(columnId)

        if (!column) {
            return res.status(404).json({ error: "Evaluation section column not found" })
        }

        await column.destroy()

        res.status(200).json({ message: "Evaluation section column deleted" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Error deleting evaluation section column" })
    }
}

export const getEvaluationSectionColumns = async (req: Request, res: Response) => {
    try {
        const { sectionId } = req.params

        const columns = await Evaluation_Section_Columns.findAll({
            where: {
                section_id: sectionId,
            },
        })

        res.status(200).json(columns)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Error fetching evaluation section columns" })
    }
}

//cells

export const createEvaluationCell = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const cell = await Evaluation_Cells.create({
            section_id: id,
            row_id: req.body.row_id,
            column_id: req.body.column_id,
            student_id: req.body.student_id,
            value_number: req.body.value_number,
            value_text: req.body.value_text,
            value_boolean: req.body.value_boolean,
        })

        res.status(200).json(cell)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Error creating evaluation cell" })
    }
}

//can we make this into upsert?
export const upsertEvaluationCell = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const cell = await Evaluation_Cells.upsert({
            id,
            section_id: id,
            row_id: req.body.row_id,
            column_id: req.body.column_id,
            student_id: req.body.student_id,
            value_number: req.body.value_number,
            value_text: req.body.value_text,
            value_boolean: req.body.value_boolean,
        })

        res.status(200).json(cell)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Error updating evaluation cell" })
    }
}

export const deleteEvaluationCell = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const cell = await Evaluation_Cells.findByPk(id)

        if (!cell) {
            return res.status(404).json({ error: "Evaluation cell not found" })
        }

        await cell.destroy()

        res.status(200).json({ message: "Evaluation cell deleted" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Error deleting evaluation cell" })
    }
}

export const getEvaluationCells = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const cells = await Evaluation_Cells.findAll({
            where: {
                section_id: id,
            },
        })

        res.status(200).json(cells)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Error fetching evaluation cells" })
    }
}

export const bulkUpsertEvaluationCells = async (req: Request, res: Response) => {
    const transaction = await sequelize.transaction()
    try {
        const { documentId, studentId } = req.params
        const { changes } = req.body

        if (!Array.isArray(changes) || changes.length === 0) {
            await transaction.rollback()
            return res.status(400).json({ error: "Changes must be a non-empty array" })
        }

        // Validate Student
        const student = await Student.findByPk(studentId)
        if (!student) {
            await transaction.rollback()
            return res.status(404).json({ error: "Student not found" })
        }

        // 1️⃣ Fetch Metadata
        const sections = await Evaluation_Section.findAll({
            where: { document_id: documentId },
            include: [
                { model: Evaluation_Section_Rows, as: "rows" },
                { model: Evaluation_Section_Columns, as: "columns" },
            ],
        })

        const sectionMap = new Map<string, Evaluation_Section>()
        const rowMap = new Map<string, Map<string, Evaluation_Section_Rows>>()
        const colMap = new Map<string, Map<string, Evaluation_Section_Columns>>()

        sections.forEach((section) => {
            sectionMap.set(section.key, section)

            const rows = new Map<string, Evaluation_Section_Rows>()
            // @ts-ignore
            section.rows?.forEach((row: Evaluation_Section_Rows) => {
                rows.set(row.key, row)
            })
            rowMap.set(section.id.toString(), rows)

            const cols = new Map<string, Evaluation_Section_Columns>()
            // @ts-ignore
            section.columns?.forEach((col: Evaluation_Section_Columns) => {
                cols.set(col.key, col)
            })
            colMap.set(section.id.toString(), cols)
        })

        // 3️⃣ Fetch Existing Cells
        const existingCells = await Evaluation_Cells.findAll({
            where: { document_id: documentId, student_id: studentId },
        })

        const cellMap = new Map<string, Evaluation_Cells>()
        existingCells.forEach((cell) => {
            const key = `${cell.section_id}-${cell.row_id}-${cell.column_id}-${cell.student_id}`
            cellMap.set(key, cell)
        })

        const toCreate: any[] = []
        const toUpdate: Evaluation_Cells[] = []
        const processedCellKeys = new Set<string>() // Track processed cells to avoid duplicates

        // 4️⃣ Process Changes
        for (const change of changes) {
            const { sectionKey, rowKey, columnKey, value } = change

            const section = sectionMap.get(sectionKey)
            const row = section ? rowMap.get(section.id.toString())?.get(rowKey) : undefined
            const col = section ? colMap.get(section.id.toString())?.get(columnKey) : undefined

            if (!section || !row || !col) {
                // Skip invalid entries
                continue
            }

            const cellKey = `${section.id}-${row.id}-${col.id}-${student.id}`

            // Skip if we already processed this cell in this batch
            if (processedCellKeys.has(cellKey)) {
                continue
            }
            processedCellKeys.add(cellKey)

            const existing = cellMap.get(cellKey)

            let valNum: number | null = null
            let valText: string | null = null
            let valBool: boolean | null = null

            if (col.value_type === "number") valNum = Number(value)
            else if (col.value_type === "boolean") valBool = Boolean(value)
            else valText = String(value)

            if (existing) {
                // Update only if changed
                let changed = false
                if (existing.value_number !== valNum) {
                    existing.value_number = valNum
                    changed = true
                }
                if (existing.value_text !== valText) {
                    existing.value_text = valText
                    changed = true
                }
                if (existing.value_boolean !== valBool) {
                    existing.value_boolean = valBool
                    changed = true
                }

                if (changed) toUpdate.push(existing)
            } else {
                toCreate.push({
                    document_id: documentId,
                    section_id: section.id,
                    row_id: row.id,
                    row_key: row.key,
                    column_id: col.id,
                    column_key: col.key,
                    student_id: student.id,
                    value_number: valNum,
                    value_text: valText,
                    value_boolean: valBool,
                })
            }
        }

        // 5️⃣ Execute DB Changes in Transaction
        if (toCreate.length > 0) {
            await Evaluation_Cells.bulkCreate(toCreate, { transaction })
        }

        await Promise.all(toUpdate.map((cell) => cell.save({ transaction })))

        await transaction.commit()
        res.status(200).json({
            success: true,
            created: toCreate.length,
            updated: toUpdate.length,
        })
    } catch (error) {
        await transaction.rollback()
        console.error(error)
        res.status(500).json({ error: "Error processing bulk upsert" })
    }
}

export const convertTemplateToForm = async (req: Request, res: Response) => {
    const t = await sequelize.transaction()
    try {
        console.log("in here")
        const { templateId } = req.params
        const { classId, rubric_id } = req.body
        const { updatedSections } = req.body || []

        const template = await Form_Template.findByPk(templateId)

        if (!template) {
            return res.status(404).json({ error: "Template not found" })
        }

        const form = await Evaluation_Document.create(
            {
                class_id: Number(classId),
                name: template.name,
                rubric_id: rubric_id || null,
            },
            { transaction: t },
        )

        const sections = await Template_Section.findAll({
            where: { template_id: templateId },
            include: [
                { model: Template_Row, as: "rows" },
                { model: Template_Column, as: "columns" },
            ],
        })

        for (const section of sections) {
            const newSection = await Evaluation_Section.create(
                {
                    document_id: form.id,
                    label: section.label,
                    key: section.key,
                    section_type: section.section_type,
                    source_table: section.source_table,
                },
                { transaction: t },
            )
            for (const element of updatedSections) {
                if (element.sectionId == section.id) {
                    for (const row of element.rows) {
                        await Evaluation_Section_Rows.create(
                            {
                                section_id: newSection.id,
                                label: row.label,
                                key: row.key,
                                row_type: row.row_type,
                            },
                            { transaction: t },
                        )
                    }
                }
            }

            if (section.rows) {
                for (const row of section.rows) {
                    await Evaluation_Section_Rows.create(
                        {
                            section_id: newSection.id,
                            label: row.label,
                            key: row.key,
                            row_type: row.row_type,
                        },
                        { transaction: t },
                    )
                }
            }

            if (section.columns) {
                for (const col of section.columns) {
                    await Evaluation_Section_Columns.create(
                        {
                            section_id: newSection.id,
                            label: col.label,
                            key: col.key,
                            value_type: col.value_type,
                        },
                        { transaction: t },
                    )
                }
            }
        }

        await t.commit()
        //return form id
        return res.status(200).json({ success: true, formId: form.id })
    } catch (err) {
        console.log(err)
        await t.rollback()
        return res.status(500).json({ error: "Error converting template to form" })
    }
}
