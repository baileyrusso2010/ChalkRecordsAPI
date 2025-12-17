import { Request, Response } from "express"
import { Op } from "sequelize"
import { Program_Catalog } from "../../models/program/program_catalog.model"

// GET /program-catalogs
// Optional query params: search (matches title or state_program_code), code (exact), title (partial)
export async function listProgramCatalogs(req: Request, res: Response) {
    try {
        const { search, code, title } = req.query as {
            search?: string
            code?: string
            title?: string
        }

        const where: any = {}

        if (code) where.state_program_code = code
        if (title) where.title = { [Op.iLike]: `%${title}%` }
        if (search) {
            where[Op.or] = [
                { title: { [Op.iLike]: `%${search}%` } },
                { state_program_code: { [Op.iLike]: `%${search}%` } },
                { description: { [Op.iLike]: `%${search}%` } },
            ]
        }

        const results = await Program_Catalog.findAll({
            where,
            order: [["title", "ASC"]],
        })

        res.json(results)
    } catch (err) {
        console.error("Error listing program catalogs", err)
        res.status(500).json({ error: "Failed to list program catalogs" })
    }
}

// GET /program-catalogs/:id
export async function getProgramCatalog(req: Request, res: Response) {
    try {
        const id = Number(req.params.id)
        if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: "Invalid id" })

        const record = await Program_Catalog.findByPk(id)
        if (!record) return res.status(404).json({ error: "Not found" })

        res.json(record)
    } catch (err) {
        console.error("Error getting program catalog", err)
        res.status(500).json({ error: "Failed to retrieve program catalog" })
    }
}
