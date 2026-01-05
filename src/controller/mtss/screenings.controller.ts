import { Request, Response } from "express"
import { Screenings } from "../../models/mtss/screenings.model"

export async function createScreening(req: Request, res: Response) {
    try {
        const screening = await Screenings.create(req.body)
        res.status(201).json(screening)
    } catch (err) {
        console.error("Error creating screening:", err)
        res.status(500).json({ error: "Failed to create screening" })
    }
}

export async function listScreenings(req: Request, res: Response) {
    try {
        const { student_id } = req.query
        const where: any = {}
        if (student_id) {
            where.student_id = student_id
        }

        const screenings = await Screenings.findAll({ where })
        res.json(screenings)
    } catch (err) {
        console.error("Error listing screenings:", err)
        res.status(500).json({ error: "Failed to list screenings" })
    }
}

export async function getScreening(req: Request, res: Response) {
    try {
        const { id } = req.params
        const screening = await Screenings.findByPk(id)
        if (!screening) {
            return res.status(404).json({ error: "Screening not found" })
        }
        res.json(screening)
    } catch (err) {
        console.error("Error getting screening:", err)
        res.status(500).json({ error: "Failed to get screening" })
    }
}

export async function updateScreening(req: Request, res: Response) {
    try {
        const { id } = req.params
        const [updated] = await Screenings.update(req.body, { where: { id } })
        if (!updated) {
            return res.status(404).json({ error: "Screening not found" })
        }
        const updatedScreening = await Screenings.findByPk(id)
        res.json(updatedScreening)
    } catch (err) {
        console.error("Error updating screening:", err)
        res.status(500).json({ error: "Failed to update screening" })
    }
}

export async function deleteScreening(req: Request, res: Response) {
    try {
        const { id } = req.params
        const deleted = await Screenings.destroy({ where: { id } })
        if (!deleted) {
            return res.status(404).json({ error: "Screening not found" })
        }
        res.status(204).send()
    } catch (err) {
        console.error("Error deleting screening:", err)
        res.status(500).json({ error: "Failed to delete screening" })
    }
}
