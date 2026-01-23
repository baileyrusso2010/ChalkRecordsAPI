import { Request, Response } from "express"
import { Form_Template } from "../../models/forms/template/form_template.model"
import { Template_Section } from "../../models/forms/template/template_section.model"
import { Template_Row } from "../../models/forms/template/template_row.model"
import { Template_Column } from "../../models/forms/template/template_column.model"

export const createTemplateForm = async (req: Request, res: Response) => {
    try {
        const { name } = req.body
        const template = await Form_Template.create({ name })
        res.json(template)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Error creating template form" })
    }
}

//will have to use tenant eventually
export const getTemplates = async (req: Request, res: Response) => {
    try {
        const templates = await Form_Template.findAll()
        res.json(templates)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Error fetching templates" })
    }
}

export const getTemplate = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        /** 1️⃣ Load form + schema */
        const form = await Form_Template.findByPk(id, {
            include: [
                {
                    model: Template_Section,
                    as: "sections",
                    include: [
                        { model: Template_Row, as: "rows" },
                        { model: Template_Column, as: "columns" },
                    ],
                },
            ],
        })

        if (!form) {
            return res.status(404).json({ error: "Form not found" })
        }

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
            name: form.name,
            sections:
                form.sections?.map((section: any) => ({
                    id: section.id,
                    key: section.key,
                    label: section.label,
                    rows: section.rows.map((row: any) => ({
                        key: row.key,
                        label: row.label,
                        description: row.description,
                        row_type: row.row_type,
                    })),
                    columns: section.columns.map((col: any) => ({
                        key: col.key,
                        label: col.label,
                        valueType: col.value_type,
                        config: col.config,
                    })),
                })) || [],
        }

        res.json({
            form: shapedForm,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Error fetching template form" })
    }
}

export const createTemplateSection = async (req: Request, res: Response) => {
    try {
        const { templateId } = req.params
        const { label } = req.body
        const section = await Template_Section.create({
            template_id: templateId,
            label,
            key: label.toLowerCase().replace(" ", "_"),
        })
        res.json(section)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Error creating template section" })
    }
}

export const getTemplateSections = async (req: Request, res: Response) => {
    try {
        const { templateId } = req.params
        const sections = await Template_Section.findAll({ where: { template_id: templateId } })
        res.json(sections)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Error fetching template sections" })
    }
}

export const createRow = async (req: Request, res: Response) => {
    try {
        const { sectionId } = req.params
        const { description, label, row_type } = req.body
        const row = await Template_Row.create({
            section_id: sectionId,
            label,
            description,
            key: label.toLowerCase().replace(" ", "_"),
            row_type,
        })
        res.json(row)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Error creating template row" })
    }
}

export const getTemplateRows = async (req: Request, res: Response) => {
    try {
        const { sectionId } = req.params
        const rows = await Template_Row.findAll({ where: { section_id: sectionId } })
        res.json(rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Error fetching template rows" })
    }
}

export const createColumn = async (req: Request, res: Response) => {
    try {
        const { sectionId } = req.params
        const { label, value_type, config } = req.body
        const column = await Template_Column.create({
            section_id: sectionId,
            key: label.toLowerCase().replace(" ", "_"),
            label,
            value_type,
            config,
        })
        res.json(column)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Error creating template column" })
    }
}

export const getTemplateColumns = async (req: Request, res: Response) => {
    try {
        const { sectionId } = req.params
        const columns = await Template_Column.findAll({ where: { section_id: sectionId } })
        res.json(columns)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Error fetching template columns" })
    }
}
