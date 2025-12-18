import { Request, Response } from "express"
import { Op } from "sequelize"
import { School } from "../../models/school/school.model"

// GET /schools
export async function listSchools(req: Request, res: Response) {
    try {
        const { districtId, search } = req.query as { districtId?: string; search?: string }
        const where: any = {}
        if (districtId) where.district_id = districtId
        if (search) where.name = { [Op.iLike]: `%${search}%` }

        const results = await School.findAll({ where, order: [["name", "ASC"]] })
        res.json(results)
    } catch (err) {
        console.error("Error listing schools", err)
        res.status(500).json({ error: "Failed to list schools" })
    }
}

// GET /schools/:id
export async function getSchool(req: Request, res: Response) {
    try {
        const id = Number(req.params.id)
        if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: "Invalid id" })

        const record = await School.findByPk(id)
        if (!record) return res.status(404).json({ error: "Not found" })
        res.json(record)
    } catch (err) {
        console.error("Error getting school", err)
        res.status(500).json({ error: "Failed to retrieve school" })
    }
}
