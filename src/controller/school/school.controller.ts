import { Request, Response } from "express"
import { Op } from "sequelize"
import { School } from "../../models/school/school.model"
import { District } from "../../models/school/district.model"

// GET /schools
export async function getSchoolDistrict(req: Request, res: Response) {
    try {
        if (
            !Number.isInteger(Number(req.params.district_id)) ||
            Number(req.params.district_id) <= 0
        )
            return res.status(400).json({ error: "Invalid district id" })
        const districtId = Number(req.params.district_id)

        const results = await District.findByPk(districtId)
        if (!results) return res.status(404).json({ error: "Not found" })
        res.json(results)
    } catch (err) {
        console.error("Error listing schools", err)
        res.status(500).json({ error: "Failed to list schools" })
    }
}

// GET /schools/:id
export async function getSchools(req: Request, res: Response) {
    try {
        const districtId = Number(req.params.district_id)
        if (!Number.isInteger(districtId) || districtId <= 0)
            return res.status(400).json({ error: "Invalid district id" })

        const record = await School.findAll({
            where: {
                district_id: districtId,
            },
        })
        if (!record) return res.status(404).json({ error: "Not found" })
        res.json(record)
    } catch (err) {
        console.error("Error getting school", err)
        res.status(500).json({ error: "Failed to retrieve school" })
    }
}
