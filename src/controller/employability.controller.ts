import { Request, Response } from "express"
import { Op } from "sequelize"
import { Employability } from "../models/forms/employability.model"

// GET /employability
export async function getEmployability(req: Request, res: Response) {
    try {
        const results = await Employability.findAll({})

        res.json(results)
    } catch (err) {
        console.error("Error listing WBL students", err)
        res.status(500).json({ error: "Failed to list WBL students" })
    }
}

export async function employabilityUpsert(req: Request, res: Response) {
    try {
        const { items } = req.body

        const results = await Promise.all(
            items.map((item: any) => Employability.upsert(item)) // Upsert each item
        )
        res.json({ results })
    } catch (err) {
        console.error("Error listing WBL students", err)
        res.status(500).json({ error: "Failed to list WBL students" })
    }
}
