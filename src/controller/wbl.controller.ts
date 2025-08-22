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
    const id = req.params.id

    try {
        const result = await WBLTypes.destroy({
            where: {
                id: id,
            },
        })

        if (result === 0) {
            res.status(404).send({ error: "WBL Type not found" })
        } else {
            res.status(200).send({ message: "WBL Type deleted successfully" })
        }
    } catch (err) {
        console.error(err)
        res.status(500).send({ error: "Internal server error" })
    }
}

export const addWBLType = async (req: Request, res: Response) => {
    const name = req.body.name

    try {
        const result = await WBLTypes.create({
            name,
        })

        res.status(201).json(result)
    } catch (err) {
        console.error(err)
        res.status(500).send({ error: "Internal server error" })
    }
}

export const editWBLType = async (req: Request, res: Response) => {
    const name = req.body.name

    try {
        const results = await WBLTypes.update(
            {
                name: name,
            },
            {
                where: { id: req.params.id },
            }
        )

        res.status(201).json(results)
    } catch (err) {
        console.error(err)
        res.status(500).send({ error: "Internal server error" })
    }
}

export const getStudentWBLHours = async (req: Request, res: Response) => {
    try {
        const results = await WBLHours.findAll({
            where: {
                studentId: req.params.studentId,
            },
        })

        res.status(200).send(results)
    } catch (err) {
        console.error(err)
        res.status(500).send({ error: "Internal server error" })
    }
}

export const insertStudentWBLHours = async (req: Request, res: Response) => {
    try {
        const result = await WBLHours.create({
            studentId: req.body.studentId,
            wblTypeId: req.body.wblTypeId,
            time: Number(req.body.time),
            notes: req.body.notes,
            date: req.body.date,
        })

        res.status(200).send(result)
    } catch (err) {
        console.error(err)
        res.status(500).send({ error: "Internal server error" })
    }
}
export const updateStudentWBLHours = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const { studentId, wblTypeId, time, notes, date } = req.body

        const [updatedRows] = await WBLHours.update(
            {
                studentId,
                wblTypeId,
                time,
                notes,
                date,
            },
            {
                where: { id },
            }
        )

        if (updatedRows === 0) {
            res.status(404).send({ error: "WBL Hours record not found" })
        } else {
            res.status(200).send({ message: "WBL Hours updated successfully" })
        }
    } catch (err) {
        console.error(err)
        res.status(500).send({ error: "Internal server error" })
    }
}

export const deleteStudentWBLHours = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const deletedRows = await WBLHours.destroy({
            where: { id },
        })

        if (deletedRows === 0) {
            res.status(404).send({ error: "WBL Hours record not found" })
        } else {
            res.status(200).send({ message: "WBL Hours deleted successfully" })
        }
    } catch (err) {
        console.error(err)
        res.status(500).send({ error: "Internal server error" })
    }
}
