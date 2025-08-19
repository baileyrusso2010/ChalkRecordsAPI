import { Request, Response } from "express"
import { Op } from "sequelize"
import { ProgramCatalog } from "../models/program_catalog.model"
import { Program } from "../models/program.model"

export const getAllProgamCatalog = async (req: Request, res: Response) => {
    try {
        const results = await ProgramCatalog.findAll({
            order: [["name", "ASC"]],
        })

        res.status(200).json(results)
    } catch (err) {
        console.error(err)
        res.status(500).send({ error: "Internal server error" })
    }
}

export const getActiveProgram = async (req: Request, res: Response) => {
    try {
        const results = await Program.findAll({
            include: [
                {
                    model: ProgramCatalog,
                    as: "program_catalog",
                },
            ],
        })

        res.status(200).json(results)
    } catch (err) {
        console.error(err)
        res.status(500).send({ error: "Internal server error" })
    }
}

export const insertProgram = async (req: Request, res: Response) => {
    try {
        const data = Array.isArray(req.body) ? req.body : [req.body]

        const results = await Program.bulkCreate(data)

        res.status(201).json(results)
    } catch (err) {
        console.error(err)
        res.status(500).send({ error: "Internal server error" })
    }
}
