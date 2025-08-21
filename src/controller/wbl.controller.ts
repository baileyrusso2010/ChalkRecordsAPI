import { Request, Response } from "express"
import { Op, fn, col, where } from "sequelize"
import { WBLHours } from "../models/wbl_hours.model"
import { WBLTypes } from "../models/wbl_types.model"

export const getWBLTypes = async (req: Request, res: Response) => {
    try {
        const enrollments = await WBLTypes.findAll({})

        res.status(200).json(enrollments)
    } catch (err) {
        console.error(err)
        res.status(500).send({ error: "Internal server error" })
    }
}

export const removeWBLType = async (req: Request, res: Response) => {
    try {
    } catch (err) {
        console.error(err)
        res.status(500).send({ error: "Internal server error" })
    }
}
