import { Request, Response } from "express"
import { Op } from "sequelize"
import { Home_School } from "../../models/school/home_school.model"

// GET /home-schools
export async function listHomeSchools(req: Request, res: Response) {
    try {
        const { schoolId, search } = req.query as { schoolId?: string; search?: string }
        const where: any = {}
        if (schoolId) where.cte_school_id = schoolId
        if (search) where.name = { [Op.iLike]: `%${search}%` }

        const results = await Home_School.findAll({ where, order: [["name", "ASC"]] })
        res.json(results)
    } catch (err) {
        console.error("Error listing home schools", err)
        res.status(500).json({ error: "Failed to list home schools" })
    }
}

// GET /home-schools/:id
export async function getHomeSchool(req: Request, res: Response) {
    try {
        const id = Number(req.params.id)
        if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: "Invalid id" })

        const record = await Home_School.findByPk(id)
        if (!record) return res.status(404).json({ error: "Not found" })
        res.json(record)
    } catch (err) {
        console.error("Error getting home school", err)
        res.status(500).json({ error: "Failed to retrieve home school" })
    }
}
