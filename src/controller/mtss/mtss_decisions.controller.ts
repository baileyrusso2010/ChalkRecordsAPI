import { Request, Response } from "express"
import { MTSS_Decisions } from "../../models/mtss/mtss_decisions.model"

export async function createDecision(req: Request, res: Response) {
    try {
        const decision = await MTSS_Decisions.create(req.body)
        res.status(201).json(decision)
    } catch (err) {
        console.error("Error creating MTSS decision:", err)
        res.status(500).json({ error: "Failed to create MTSS decision" })
    }
}

export async function listDecisions(req: Request, res: Response) {
    try {
        const { meeting_id } = req.query
        const where: any = {}
        if (meeting_id) {
            where.meeting_id = meeting_id
        }

        const decisions = await MTSS_Decisions.findAll({ where })
        res.json(decisions)
    } catch (err) {
        console.error("Error listing MTSS decisions:", err)
        res.status(500).json({ error: "Failed to list MTSS decisions" })
    }
}

export async function getDecision(req: Request, res: Response) {
    try {
        const { id } = req.params
        const decision = await MTSS_Decisions.findByPk(id)
        if (!decision) {
            return res.status(404).json({ error: "MTSS decision not found" })
        }
        res.json(decision)
    } catch (err) {
        console.error("Error getting MTSS decision:", err)
        res.status(500).json({ error: "Failed to get MTSS decision" })
    }
}

export async function updateDecision(req: Request, res: Response) {
    try {
        const { id } = req.params
        const [updated] = await MTSS_Decisions.update(req.body, { where: { id } })
        if (!updated) {
            return res.status(404).json({ error: "MTSS decision not found" })
        }
        const updatedDecision = await MTSS_Decisions.findByPk(id)
        res.json(updatedDecision)
    } catch (err) {
        console.error("Error updating MTSS decision:", err)
        res.status(500).json({ error: "Failed to update MTSS decision" })
    }
}

export async function deleteDecision(req: Request, res: Response) {
    try {
        const { id } = req.params
        const deleted = await MTSS_Decisions.destroy({ where: { id } })
        if (!deleted) {
            return res.status(404).json({ error: "MTSS decision not found" })
        }
        res.status(204).send()
    } catch (err) {
        console.error("Error deleting MTSS decision:", err)
        res.status(500).json({ error: "Failed to delete MTSS decision" })
    }
}
