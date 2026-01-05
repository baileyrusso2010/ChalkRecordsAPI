import { Request, Response } from "express"
import { Interventions } from "../../models/mtss/interventions.model"

export async function createIntervention(req: Request, res: Response) {
    try {
        const intervention = await Interventions.create(req.body)
        res.status(201).json(intervention)
    } catch (err) {
        console.error("Error creating intervention:", err)
        res.status(500).json({ error: "Failed to create intervention" })
    }
}

export async function listInterventions(req: Request, res: Response) {
    try {
        const interventions = await Interventions.findAll()
        res.json(interventions)
    } catch (err) {
        console.error("Error listing interventions:", err)
        res.status(500).json({ error: "Failed to list interventions" })
    }
}

export async function getIntervention(req: Request, res: Response) {
    try {
        const { id } = req.params
        const intervention = await Interventions.findByPk(id)
        if (!intervention) {
            return res.status(404).json({ error: "Intervention not found" })
        }
        res.json(intervention)
    } catch (err) {
        console.error("Error getting intervention:", err)
        res.status(500).json({ error: "Failed to get intervention" })
    }
}

export async function updateIntervention(req: Request, res: Response) {
    try {
        const { id } = req.params
        const [updated] = await Interventions.update(req.body, { where: { id } })
        if (!updated) {
            return res.status(404).json({ error: "Intervention not found" })
        }
        const updatedIntervention = await Interventions.findByPk(id)
        res.json(updatedIntervention)
    } catch (err) {
        console.error("Error updating intervention:", err)
        res.status(500).json({ error: "Failed to update intervention" })
    }
}

export async function deleteIntervention(req: Request, res: Response) {
    try {
        const { id } = req.params
        const deleted = await Interventions.destroy({ where: { id } })
        if (!deleted) {
            return res.status(404).json({ error: "Intervention not found" })
        }
        res.status(204).send()
    } catch (err) {
        console.error("Error deleting intervention:", err)
        res.status(500).json({ error: "Failed to delete intervention" })
    }
}
