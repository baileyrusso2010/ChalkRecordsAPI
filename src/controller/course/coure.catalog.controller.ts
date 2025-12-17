import { Request, Response } from "express"
import { Op } from "sequelize"
import { Course_Catalog } from "../../models/course/course_catalog.model"

// GET /course-catalogs
// Optional query params: search (matches title or course_code), code (exact), title (partial)
export async function listCourseCatalogs(req: Request, res: Response) {
    try {
        const { search, code, title } = req.query as {
            search?: string
            code?: string
            title?: string
        }

        const where: any = {}

        if (code) where.course_code = code
        if (title) where.title = { [Op.iLike]: `%${title}%` }
        if (search) {
            where[Op.or] = [
                { title: { [Op.iLike]: `%${search}%` } },
                { course_code: { [Op.iLike]: `%${search}%` } },
                { description: { [Op.iLike]: `%${search}%` } },
            ]
        }

        const results = await Course_Catalog.findAll({
            where,
            order: [["title", "ASC"]],
        })

        res.json(results)
    } catch (err) {
        console.error("Error listing course catalogs", err)
        res.status(500).json({ error: "Failed to list course catalogs" })
    }
}

// GET /course-catalogs/:id
export async function getCourseCatalog(req: Request, res: Response) {
    try {
        const id = Number(req.params.id)
        if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: "Invalid id" })

        const record = await Course_Catalog.findByPk(id)
        if (!record) return res.status(404).json({ error: "Not found" })

        res.json(record)
    } catch (err) {
        console.error("Error listing course catalogs", err)
        res.status(500).json({ error: "Failed to list course catalogs" })
    }
}
