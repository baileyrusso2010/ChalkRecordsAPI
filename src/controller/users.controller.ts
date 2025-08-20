import { Request, Response } from "express"
import { Op } from "sequelize"
import { Users } from "../models/users.model"

export const getTeachers = async (req: Request, res: Response) => {
    try {
        const results = await Users.findAll({})

        res.status(200).json(results)
    } catch (err) {
        console.error(err)
        res.status(500).send({ error: "Internal server error" })
    }
}
