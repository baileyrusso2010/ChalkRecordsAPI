import { Request, Response } from "express"
import { Op } from "sequelize"
import { WBL_Hours } from "../../models/wbl/wbl_hours.model"
import { WBL_Catagories } from "../../models/wbl/wbl_catagories.model"
import { Student } from "../../models/student.model"

function parseId(value: any): number | null {
    const n = Number(value)
    return Number.isInteger(n) && n > 0 ? n : null
}

// GET /wbl-students
export async function listWblStudents(req: Request, res: Response) {
    try {
        const { studentId } = req.query as { studentId?: string }
        const where: any = {}
        if (studentId) where.student_id = studentId

        const results = await WBL_Hours.findAll({
            where,
            order: [["id", "ASC"]],
        })
        res.json(results)
    } catch (err) {
        console.error("Error listing WBL students", err)
        res.status(500).json({ error: "Failed to list WBL students" })
    }
}

// GET /wbl-students/:id
export async function getWblStudent(req: Request, res: Response) {
    try {
        const studentId = parseId(req.params.id)
        if (!studentId) return res.status(400).json({ error: "Invalid student id" })

        const records = await WBL_Catagories.findAll({
            include: [
                {
                    model: WBL_Hours,
                    as: "wbl_hours",
                    where: { student_id: studentId },
                },
            ],
        })

        res.json(records)
    } catch (err) {
        console.error("Error getting WBL student", err)
        res.status(500).json({ error: "Failed to retrieve WBL student" })
    }
} // POST /wbl-students
export async function createWblStudent(req: Request, res: Response) {
    try {
        const { student_id, hours, comments, date, catagory_id } = req.body
        if (!student_id) return res.status(400).json({ error: "student_id is required" })

        // Optional: ensure referenced student exists
        const created = await WBL_Hours.create({ student_id, hours, comments, date, catagory_id })
        res.status(201).json(created)
    } catch (err) {
        console.error("Error creating WBL student", err)
        res.status(500).json({ error: "Failed to create WBL student" })
    }
}

// PUT /wbl-students/:id
export async function updateWblStudent(req: Request, res: Response) {
    try {
        const id = parseId(req.params.id)
        if (!id) return res.status(400).json({ error: "Invalid id" })

        const record = await WBL_Hours.findByPk(id)
        if (!record) return res.status(404).json({ error: "Not found" })

        const { student_id, hours, comments } = req.body
        await record.update({
            student_id: student_id ?? record.get("student_id"),
            hours: hours ?? record.get("hours"),
            comments: comments ?? record.get("comments"),
        })

        res.json(record)
    } catch (err) {
        console.error("Error updating WBL student", err)
        res.status(500).json({ error: "Failed to update WBL student" })
    }
}

// DELETE /wbl-students/:id
export async function deleteWblStudent(req: Request, res: Response) {
    try {
        const id = parseId(req.params.id)
        if (!id) return res.status(400).json({ error: "Invalid id" })

        const record = await WBL_Hours.findByPk(id)
        if (!record) return res.status(404).json({ error: "Not found" })

        await record.destroy()
        res.status(204).send()
    } catch (err) {
        console.error("Error deleting WBL student", err)
        res.status(500).json({ error: "Failed to delete WBL student" })
    }
}
