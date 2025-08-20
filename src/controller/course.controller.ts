import { Request, Response } from "express"
import { Op } from "sequelize"
import { CourseCatalog } from "../models/course_catalog.model"
import { Course } from "../models/course.model"
import { Program } from "../models/program.model"
import { ProgramCatalog } from "../models/program_catalog.model"
import { Users } from "../models/users.model"

export const getAllCourseCatalogs = async (req: Request, res: Response) => {
    try {
        const results = await CourseCatalog.findAll({})

        res.status(200).json(results)
    } catch (err) {
        console.error(err)
        res.status(500).send({ error: "Internal server error" })
    }
}
export const insertCourse = async (req: Request, res: Response) => {
    try {
        const item = req.body

        const required = ["program_id", "catalog_id", "alias", "teacher_id", "school_id"]
        const missing = required.find((f) => item[f] === undefined || item[f] === null)
        if (missing) {
            return res.status(400).json({ error: `Missing required field: ${missing}` })
        }

        const row = await Course.create(item)
        res.status(201).json(row)
    } catch (e: any) {
        console.error(e)
        if (e.name === "SequelizeValidationError") {
            return res.status(400).json({
                error: "Validation failed",
                details: e.errors.map((x: any) => ({ field: x.path, message: x.message })),
            })
        }
        res.status(500).json({ error: "Internal server error" })
    }
}

export const getAllCourses = async (req: Request, res: Response) => {
    try {
        const results = await Course.findAll({
            include: [
                {
                    model: CourseCatalog,
                    as: "course_catalog",
                    attributes: ["course_code", "course_name", "course_description"],
                },
                {
                    model: Users,
                    as: "users",
                },
                {
                    model: Program,
                    as: "program",
                    attributes: ["id"],
                    include: [
                        {
                            model: ProgramCatalog,
                            as: "program_catalog",
                            attributes: ["code", "name"],
                        },
                    ],
                },
            ],
            attributes: ["alias", "school_year"],
            order: [["id", "DESC"]],
        })

        res.status(200).json(results)
    } catch (err) {
        console.error(err)
        res.status(500).send({ error: "Internal server error" })
    }
}
