import { Request, Response } from "express"
import { Op } from "sequelize"
import { CourseCatalog } from "../models/course_catalog.model"
import { Course } from "../models/course.model"

export const getAllCourseCatalogs = async (req: Request, res: Response) => {
    try {
        const results = await CourseCatalog.findAll({})

        res.status(200).json(results)
    } catch (err) {
        console.error(err)
        res.status(500).send({ error: "Internal server error" })
    }
}

export const insertCourses = async (req: Request, res: Response) => {
    try {
        const data = Array.isArray(req.body) ? req.body : [req.body]

        const results = await Course.bulkCreate(data)

        res.status(201).json(results)
    } catch (err) {
        console.error(err)
        res.status(500).send({ error: "Internal server error" })
    }
}

export const getAllCourses = async (req: Request, res: Response) => {
    try {
        const results = await Course.findAll({})

        res.status(200).json(results)
    } catch (err) {
        console.error(err)
        res.status(500).send({ error: "Internal server error" })
    }
}
