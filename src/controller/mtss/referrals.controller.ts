import { Request, Response } from "express"
import { Referrals } from "../../models/mtss/referrals.model"

export async function createReferral(req: Request, res: Response) {
    try {
        const referral = await Referrals.create(req.body)
        res.status(201).json(referral)
    } catch (err) {
        console.error("Error creating referral:", err)
        res.status(500).json({ error: "Failed to create referral" })
    }
}

export async function listReferrals(req: Request, res: Response) {
    try {
        const { student_id } = req.query
        const where: any = {}
        if (student_id) {
            where.student_id = student_id
        }

        const referrals = await Referrals.findAll({ where })
        res.json(referrals)
    } catch (err) {
        console.error("Error listing referrals:", err)
        res.status(500).json({ error: "Failed to list referrals" })
    }
}

export async function getReferral(req: Request, res: Response) {
    try {
        const { id } = req.params
        const referral = await Referrals.findByPk(id)
        if (!referral) {
            return res.status(404).json({ error: "Referral not found" })
        }
        res.json(referral)
    } catch (err) {
        console.error("Error getting referral:", err)
        res.status(500).json({ error: "Failed to get referral" })
    }
}

export async function updateReferral(req: Request, res: Response) {
    try {
        const { id } = req.params
        const [updated] = await Referrals.update(req.body, { where: { id } })
        if (!updated) {
            return res.status(404).json({ error: "Referral not found" })
        }
        const updatedReferral = await Referrals.findByPk(id)
        res.json(updatedReferral)
    } catch (err) {
        console.error("Error updating referral:", err)
        res.status(500).json({ error: "Failed to update referral" })
    }
}

export async function deleteReferral(req: Request, res: Response) {
    try {
        const { id } = req.params
        const deleted = await Referrals.destroy({ where: { id } })
        if (!deleted) {
            return res.status(404).json({ error: "Referral not found" })
        }
        res.status(204).send()
    } catch (err) {
        console.error("Error deleting referral:", err)
        res.status(500).json({ error: "Failed to delete referral" })
    }
}
