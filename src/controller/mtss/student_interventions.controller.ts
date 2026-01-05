import { Request, Response } from "express"
import { Student_Interventions } from "../../models/mtss/student_interventions.model"
import { Interventions } from "../../models/mtss/interventions.model"

export async function createStudentIntervention(req: Request, res: Response) {
    try {
        const studentIntervention = await Student_Interventions.create(req.body)
        res.status(201).json(studentIntervention)
    } catch (err) {
        console.error("Error creating student intervention:", err)
        res.status(500).json({ error: "Failed to create student intervention" })
    }
}

export async function listStudentInterventions(req: Request, res: Response) {
    try {
        const { student_id, domain_id, tier_id } = req.query as {
            student_id?: string
            domain_id?: string
            tier_id?: string
        }

        const where: any = {}
        if (student_id) where.student_id = student_id

        const include: any[] = []

        // Filter by related Intervention properties (domain_id, tier_id)
        if (domain_id || tier_id) {
            const interventionWhere: any = {}
            if (domain_id) interventionWhere.domain_id = domain_id
            if (tier_id) interventionWhere.tier_id = tier_id

            include.push({
                model: Interventions,
                where: interventionWhere,
                required: true, // Inner join to enforce the filter
            })
        } else {
            // Optional: always include intervention details if preferred, but for now just include if filtering or maybe standard include
            include.push({
                model: Interventions,
                required: false,
            })
        }

        const results = await Student_Interventions.findAll({
            where,
            include,
        })
        res.json(results)
    } catch (err) {
        console.error("Error listing student interventions:", err)
        res.status(500).json({ error: "Failed to list student interventions" })
    }
}

export async function getStudentIntervention(req: Request, res: Response) {
    try {
        const { id } = req.params
        const studentIntervention = await Student_Interventions.findByPk(id, {
            include: [Interventions],
        })
        if (!studentIntervention) {
            return res.status(404).json({ error: "Student intervention not found" })
        }
        res.json(studentIntervention)
    } catch (err) {
        console.error("Error getting student intervention:", err)
        res.status(500).json({ error: "Failed to get student intervention" })
    }
}

export async function updateStudentIntervention(req: Request, res: Response) {
    try {
        const { id } = req.params
        const [updated] = await Student_Interventions.update(req.body, { where: { id } })
        if (!updated) {
            return res.status(404).json({ error: "Student intervention not found" })
        }
        const updatedRecord = await Student_Interventions.findByPk(id)
        res.json(updatedRecord)
    } catch (err) {
        console.error("Error updating student intervention:", err)
        res.status(500).json({ error: "Failed to update student intervention" })
    }
}

export async function deleteStudentIntervention(req: Request, res: Response) {
    try {
        const { id } = req.params
        // Soft delete: set status to discontinued and end_date to now
        const [updated] = await Student_Interventions.update(
            {
                status: "discontinued",
                end_date: new Date(),
            },
            { where: { id } }
        )

        if (!updated) {
            return res.status(404).json({ error: "Student intervention not found" })
        }
        res.status(200).json({ message: "Student intervention soft-deleted (discontinued)" })
    } catch (err) {
        console.error("Error deleting student intervention:", err)
        res.status(500).json({ error: "Failed to delete student intervention" })
    }
}
