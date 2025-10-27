import { Request, Response } from "express"
import { Op } from "sequelize"
import { Form } from "../models/forms/form.model"
import { v4 as uuidv4 } from "uuid"

// GET /form/:id
export async function getForm(req: Request, res: Response) {
    try {
        const id = Number(req.params.id)

        const results = await Form.findByPk(id)

        res.json(results)
    } catch (err) {
        console.error("Failed to get forms", err)
        res.status(500).json({ error: "Failed to get forms" })
    }
}

export async function addOccupationalSkills(req: Request, res: Response) {
    try {
        const id = Number(req.params.id)
        const { skills, type } = req.body // type: "occupational" or "industry"

        const form = await Form.findByPk(id)

        if (!form) {
            return res.status(404).json({ error: "Form not found" })
        }

        // Ensure form_data exists
        const data = form.form_data || {}

        const uuid = uuidv4()

        // Ensure occupationalSkills is always an array
        const skillsArray = Array.isArray(skills) ? skills : [skills]

        // Assign a uuid to each new skill
        const skillsWithIds = skillsArray.map((skill: any) => ({
            id: uuidv4(),
            ...skill,
        }))

        // Merge with existing skills
        const key = type === "occupational" ? "occupationalSkills" : "industrySkills"
        const updatedData = {
            ...data,
            [key]: [...((data as any)[key] || []), ...skillsWithIds],
        }

        // Save back to DB
        form.form_data = updatedData
        await form.save()

        return res.status(200).json({ message: `${type} skills added`, form_data: form.form_data })
    } catch (err) {
        console.error("Failed to insert forms", err)
        res.status(500).json({ error: "Failed to insert forms" })
    }
}

export async function updateOccupationalSkills(req: Request, res: Response) {
    try {
        const id = Number(req.params.id)
        const { skillId, updatedFields, type } = req.body

        const form = await Form.findByPk(id)
        if (!form) {
            return res.status(404).json({ error: "Form not found" })
        }

        const data = form.form_data || {}
        const key = type === "occupational" ? "occupationalSkills" : "industrySkills"
        if (!Array.isArray((data as any)[key])) {
            return res.status(400).json({ error: `No ${type} skills found` })
        }

        const updatedSkills = (data as any).occupationalSkills.map((skill: any) =>
            skill.id === skillId ? { ...skill, ...updatedFields } : skill
        )

        const updatedFormData: any = { ...(data as any), occupationalSkills: updatedSkills }
        form.form_data = updatedFormData

        await form.save()

        return res
            .status(200)
            .json({ message: `${type} skills updated`, form_data: form.form_data })
    } catch (err) {
        console.error("Failed to update forms", err)
        res.status(500).json({ error: "Failed to update forms" })
    }
}

export async function deleteOccupationalSkill(req: Request, res: Response) {
    try {
        const formId = Number(req.params.id)
        const { skillId, type } = req.body // id of skill to delete, type: "occupational" or "industry"

        const form = await Form.findByPk(formId)
        if (!form) return res.status(404).json({ error: "Form not found" })

        const data = form.form_data || {}
        const key = type === "occupational" ? "occupationalSkills" : "industrySkills"
        if (!Array.isArray((data as any)[key])) {
            return res.status(400).json({ error: `No ${type} skills found` })
        }

        // Remove skill by id
        const updatedSkills = (data as any)[key].filter((skill: any) => skill.id !== skillId)

        const updatedFormData: any = { ...(data as any), occupationalSkills: updatedSkills }
        form.form_data = updatedFormData
        await form.save()

        res.status(200).json({ message: "Skill deleted", form_data: form.form_data })
    } catch (err) {
        console.error("Failed to delete skill", err)
        res.status(500).json({ error: "Failed to delete skill" })
    }
}
