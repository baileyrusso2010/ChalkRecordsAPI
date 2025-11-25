import { Request, Response } from "express"
import Form_Static_Fields from "../models/forms/form_static_fields"
import Form_Static_Values from "../models/forms/form_static_values"
import { Rubric_Sections } from "../models/forms/rubric_sections.model"
import { Student } from "../models/student.model"

// List fields for a form
export async function listStaticFields(req: Request, res: Response) {
    const { formId } = req.params
    const { studentId } = req.query

    try {
        const sections = await Rubric_Sections.findAll({
            where: { form_id: formId },
            include: [
                {
                    model: Form_Static_Fields,
                    as: "static_fields",
                    include: [
                        {
                            model: Form_Static_Values,
                            as: "static_values",
                            required: false,
                            where: studentId ? { student_id: studentId } : undefined,
                        },
                    ],
                },
            ],
            order: [
                ["id", "ASC"],
                [{ model: Form_Static_Fields, as: "static_fields" }, "id", "ASC"],
            ],
        })
        res.json(sections)
    } catch (err) {
        console.error("Error listing static fields", err)
        res.status(500).json({ error: "Failed to list static fields" })
    }
}

// Create field
export async function createStaticField(req: Request, res: Response) {
    try {
        const payload = Array.isArray(req.body) ? req.body : [req.body]

        const normalized = payload.map((item) => ({
            rubric_section_id: item.rubric_section_id,
            field_name: item.field_name,
            field_type: item.field_type,
            category: item.category,
        }))

        const hasMissing = normalized.some(
            (field) =>
                field.rubric_section_id === undefined ||
                field.rubric_section_id === null ||
                !field.field_name ||
                !field.field_type
        )

        if (hasMissing) {
            return res.status(400).json({
                error: "Each field must include rubric_section_id, field_name, and field_type values.",
            })
        }

        const created = await Form_Static_Fields.bulkCreate(normalized, {
            validate: true,
        })

        res.status(201).json(Array.isArray(req.body) ? created : created[0])
    } catch (err) {
        console.error("Error creating static field", err)
        res.status(500).json({ error: "Failed to create static field, Correct" })
    }
}

// Update field
export async function updateStaticField(req: Request, res: Response) {
    const { fieldId } = req.params
    try {
        const field = await Form_Static_Fields.findByPk(fieldId)
        if (!field) return res.status(404).json({ error: "Field not found" })
        await field.update(req.body)
        res.json(field)
    } catch (err) {
        console.error("Error updating static field", err)
        res.status(500).json({ error: "Failed to update static field" })
    }
}

// Delete field
export async function deleteStaticField(req: Request, res: Response) {
    const { fieldId } = req.params
    try {
        const field = await Form_Static_Fields.findByPk(fieldId)
        if (!field) return res.status(404).json({ error: "Field not found" })
        await field.destroy()
        res.json({ success: true })
    } catch (err) {
        console.error("Error deleting static field", err)
        res.status(500).json({ error: "Failed to delete static field" })
    }
}

// Save static values for a student
export async function saveStaticValues(req: Request, res: Response) {
    const { studentId } = req.params
    const { values } = req.body // array of { field_id, value }

    const t = await Form_Static_Values.sequelize!.transaction()

    try {
        // Validate student exists
        const student = await Student.findByPk(studentId, { transaction: t })
        if (!student) {
            await t.rollback()
            return res.status(404).json({ error: "Student not found" })
        }

        for (const v of values) {
            await Form_Static_Values.upsert(
                {
                    form_static_field: v.field_id,
                    student_id: Number(studentId),
                    value: v.value,
                },
                { transaction: t }
            )
        }

        await t.commit()
        res.json({ success: true })
    } catch (err) {
        await t.rollback()
        console.error("Error saving static values", err)
        res.status(500).json({ error: "Failed to save static values" })
    }
}

// Seed test static fields for quick verification
