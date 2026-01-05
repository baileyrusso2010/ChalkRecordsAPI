import { Request, Response } from "express"
import { Progress_Monitoring } from "../../models/mtss/progress_monitoring.model"

export async function createProgress(req: Request, res: Response) {
    try {
        const progress = await Progress_Monitoring.create(req.body)
        res.status(201).json(progress)
    } catch (err) {
        console.error("Error creating progress monitoring record:", err)
        res.status(500).json({ error: "Failed to create progress monitoring record" })
    }
}

export async function listProgress(req: Request, res: Response) {
    try {
        const { student_intervention_id } = req.query
        const where: any = {}

        // Progress monitoring is always scoped to a student intervention
        if (student_intervention_id) {
            where.student_intervention_id = student_intervention_id
        }

        const progress = await Progress_Monitoring.findAll({
            where,
            order: [["measurement_date", "ASC"]],
        })
        res.json(progress)
    } catch (err) {
        console.error("Error listing progress monitoring records:", err)
        res.status(500).json({ error: "Failed to list progress monitoring records" })
    }
}

export async function getProgress(req: Request, res: Response) {
    try {
        const { id } = req.params
        const progress = await Progress_Monitoring.findByPk(id)
        if (!progress) {
            return res.status(404).json({ error: "Progress monitoring record not found" })
        }
        res.json(progress)
    } catch (err) {
        console.error("Error getting progress monitoring record:", err)
        res.status(500).json({ error: "Failed to get progress monitoring record" })
    }
}

export async function updateProgress(req: Request, res: Response) {
    try {
        const { id } = req.params
        const [updated] = await Progress_Monitoring.update(req.body, { where: { id } })
        if (!updated) {
            return res.status(404).json({ error: "Progress monitoring record not found" })
        }
        const updatedRecord = await Progress_Monitoring.findByPk(id)
        res.json(updatedRecord)
    } catch (err) {
        console.error("Error updating progress monitoring record:", err)
        res.status(500).json({ error: "Failed to update progress monitoring record" })
    }
}

export async function deleteProgress(req: Request, res: Response) {
    try {
        const { id } = req.params
        const deleted = await Progress_Monitoring.destroy({ where: { id } })
        if (!deleted) {
            return res.status(404).json({ error: "Progress monitoring record not found" })
        }
        res.status(204).send()
    } catch (err) {
        console.error("Error deleting progress monitoring record:", err)
        res.status(500).json({ error: "Failed to delete progress monitoring record" })
    }
}
