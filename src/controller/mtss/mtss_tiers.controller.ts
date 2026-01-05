import { Request, Response } from "express"
import { MTSS_Tiers } from "../../models/mtss/mtss_tiers.model"

export async function createTier(req: Request, res: Response) {
    try {
        const tier = await MTSS_Tiers.create(req.body)
        res.status(201).json(tier)
    } catch (err) {
        console.error("Error creating MTSS tier:", err)
        res.status(500).json({ error: "Failed to create MTSS tier" })
    }
}

export async function listTiers(req: Request, res: Response) {
    try {
        const tiers = await MTSS_Tiers.findAll()
        res.json(tiers)
    } catch (err) {
        console.error("Error listing MTSS tiers:", err)
        res.status(500).json({ error: "Failed to list MTSS tiers" })
    }
}

export async function getTier(req: Request, res: Response) {
    try {
        const { id } = req.params
        const tier = await MTSS_Tiers.findByPk(id)
        if (!tier) {
            return res.status(404).json({ error: "MTSS tier not found" })
        }
        res.json(tier)
    } catch (err) {
        console.error("Error getting MTSS tier:", err)
        res.status(500).json({ error: "Failed to get MTSS tier" })
    }
}

export async function updateTier(req: Request, res: Response) {
    try {
        const { id } = req.params
        const [updated] = await MTSS_Tiers.update(req.body, { where: { id } })
        if (!updated) {
            return res.status(404).json({ error: "MTSS tier not found" })
        }
        const updatedTier = await MTSS_Tiers.findByPk(id)
        res.json(updatedTier)
    } catch (err) {
        console.error("Error updating MTSS tier:", err)
        res.status(500).json({ error: "Failed to update MTSS tier" })
    }
}

export async function deleteTier(req: Request, res: Response) {
    try {
        const { id } = req.params
        const deleted = await MTSS_Tiers.destroy({ where: { id } })
        if (!deleted) {
            return res.status(404).json({ error: "MTSS tier not found" })
        }
        res.status(204).send()
    } catch (err) {
        console.error("Error deleting MTSS tier:", err)
        res.status(500).json({ error: "Failed to delete MTSS tier" })
    }
}
