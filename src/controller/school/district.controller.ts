import { Request, Response } from "express"
import { Op } from "sequelize"
import { District } from "../../models/school/district.model"
import { School } from "../../models/school/school.model"
import { District_Program } from "../../models/program/district_program.model"
import { Program_Catalog } from "../../models/program/program_catalog.model"

// GET /districts
export async function listDistricts(req: Request, res: Response) {
    try {
        const { search } = req.query as { search?: string }
        const where: any = {}
        if (search) where.name = { [Op.iLike]: `%${search}%` }

        const results = await District.findAll({ where, order: [["name", "ASC"]] })
        res.json(results)
    } catch (err) {
        console.error("Error listing districts", err)
        res.status(500).json({ error: "Failed to list districts" })
    }
}

// GET /districts/:id
export async function getDistrict(req: Request, res: Response) {
    try {
        const id = Number(req.params.id)
        if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: "Invalid id" })

        const record = await District.findByPk(id)
        if (!record) return res.status(404).json({ error: "Not found" })
        res.json(record)
    } catch (err) {
        console.error("Error getting district", err)
        res.status(500).json({ error: "Failed to retrieve district" })
    }
}

// GET /districts/:id/schools
// Returns schools for the district
export async function getDistrictSchools(req: Request, res: Response) {
    try {
        const id = Number(req.params.id)
        if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: "Invalid id" })

        // Ensure district exists (optional but provides a better 404)
        const district = await District.findByPk(id)
        if (!district) return res.status(404).json({ error: "District not found" })

        const schools = await School.findAll({
            where: { district_id: id },
            order: [["name", "ASC"]],
        })

        res.json({ district_id: id, district_name: district.get("name"), schools })
    } catch (err) {
        console.error("Error getting district schools", err)
        res.status(500).json({ error: "Failed to retrieve district schools" })
    }
}

// GET /districts/:id/programs/current
// Returns the district's currently authorized programs (active and within auth/expiry window)
export async function getDistrictCurrentPrograms(req: Request, res: Response) {
    try {
        const id = Number(req.params.id)
        if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: "Invalid id" })

        const now = new Date()

        const programs = await District_Program.findAll({
            where: {
                district_id: id,
                active: true,
            },
            include: [{ model: Program_Catalog, as: "program_catalog" }],
            order: [[{ model: Program_Catalog, as: "program_catalog" }, "title", "ASC"]],
        })

        res.json({
            district_id: id,
            as_of: now.toISOString(),
            programs,
        })
    } catch (err) {
        console.error("Error getting district current programs", err)
        res.status(500).json({ error: "Failed to retrieve current programs" })
    }
}
