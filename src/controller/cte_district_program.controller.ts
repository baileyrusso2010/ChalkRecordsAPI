import { Request, Response } from "express"
import { Op } from "sequelize"
import { CTE_District_Program } from "../models/program/cte_district_program.model"
import { Program_Catalog } from "../models/program/program_catalog.model"
import { CTE_District } from "../models/school/cte_district.model"
import { Course_Instance } from "../models/course/course_instance.model"
import { Staff } from "../models/staff.model"

// Helper to parse ID param safely
function parseId(value: any): number | null {
    const n = Number(value)
    return Number.isInteger(n) && n > 0 ? n : null
}

// GET /cte-district-programs
export async function listDistrictPrograms(req: Request, res: Response) {
    try {
        const { districtId, programId, active } = req.query
        const where: any = {}

        if (districtId) where.cte_district_id = districtId
        if (programId) where.program_id = programId
        if (active !== undefined) where.active = active === "true"

        const results = await CTE_District_Program.findAll({
            where,
            include: [{ model: Program_Catalog, as: "program_catalog" }],
            order: [["id", "ASC"]],
        })
        res.json(results)
    } catch (err: any) {
        console.error("Error listing district programs", err)
        res.status(500).json({ error: "Failed to list district programs" })
    }
}

// GET /cte-district-programs/:id
export async function getDistrictProgram(req: Request, res: Response) {
    try {
        const id = parseId(req.params.id)
        if (!id) return res.status(400).json({ error: "Invalid id" })

        const record = await CTE_District_Program.findByPk(id, {
            include: [
                { model: Program_Catalog, as: "program_catalog" },
                { model: CTE_District, as: "district" },
            ],
        })

        if (!record) return res.status(404).json({ error: "Not found" })
        res.json(record)
    } catch (err) {
        console.error("Error getting district program", err)
        res.status(500).json({ error: "Failed to retrieve district program" })
    }
}

// POST /cte-district-programs
export async function createDistrictProgram(req: Request, res: Response) {
    try {
        const { cte_district_id, program_id, authorization_date, expiration_date, active } =
            req.body

        if (!cte_district_id || !program_id) {
            return res.status(400).json({ error: "cte_district_id and program_id are required" })
        }

        const created = await CTE_District_Program.create({
            cte_district_id,
            program_id,
            authorization_date: authorization_date ? new Date(authorization_date) : undefined,
            expiration_date: expiration_date ? new Date(expiration_date) : undefined,
            active: active !== undefined ? !!active : true,
        })

        res.status(201).json(created)
    } catch (err: any) {
        console.error("Error creating district program", err)
        res.status(500).json({ error: "Failed to create district program" })
    }
}

// PUT /cte-district-programs/:id
export async function updateDistrictProgram(req: Request, res: Response) {
    try {
        const id = parseId(req.params.id)
        if (!id) return res.status(400).json({ error: "Invalid id" })

        const record = await CTE_District_Program.findByPk(id)
        if (!record) return res.status(404).json({ error: "Not found" })

        const { cte_district_id, program_id, authorization_date, expiration_date, active } =
            req.body

        await record.update({
            cte_district_id: cte_district_id ?? record.cte_district_id,
            program_id: program_id ?? record.program_id,
            authorization_date:
                authorization_date !== undefined
                    ? new Date(authorization_date)
                    : record.authorization_date,
            expiration_date:
                expiration_date !== undefined ? new Date(expiration_date) : record.expiration_date,
            active: active !== undefined ? !!active : record.active,
        })

        res.json(record)
    } catch (err) {
        console.error("Error updating district program", err)
        res.status(500).json({ error: "Failed to update district program" })
    }
}

// DELETE /cte-district-programs/:id
export async function deleteDistrictProgram(req: Request, res: Response) {
    try {
        const id = parseId(req.params.id)
        if (!id) return res.status(400).json({ error: "Invalid id" })

        const record = await CTE_District_Program.findByPk(id)
        if (!record) return res.status(404).json({ error: "Not found" })

        await record.destroy()
        res.status(204).send()
    } catch (err) {
        console.error("Error deleting district program", err)
        res.status(500).json({ error: "Failed to delete district program" })
    }
}
