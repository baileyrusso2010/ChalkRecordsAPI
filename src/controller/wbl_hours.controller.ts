import { Request, Response } from "express"
import { Op } from "sequelize"
import { WBL_types } from "../models/wbl_types.model"
import { Student_WBL } from "../models/student_wbl_hours.model"

export const createWBLTypes = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name } = req.body

        // Validate input
        if (!name) {
            res.status(400).json({ error: "Name and description are required" })
            return
        }

        // Create new WBL type
        const newWBLType = await WBL_types.create({ name })

        res.status(201).json(newWBLType)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to create WBL type" })
    }
}

export const getWBLTypes = async (req: Request, res: Response): Promise<void> => {
    try {
        const wblTypes = await WBL_types.findAll()

        res.status(200).json(wblTypes)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to retrieve WBL types" })
    }
}

export const updateWBLType = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params
        const { name } = req.body

        const wblType = await WBL_types.findByPk(id)
        if (!wblType) {
            res.status(404).json({ error: "WBL type not found" })
            return
        }

        WBL_types.update(
            { name },
            {
                where: { id },
            }
        )
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to update WBL type" })
    }
}

//could cause problems if the WBL type is used in Student_WBL
//consider adding a check to see if the WBL type is used in Student_WBL before
export const deleteWBLType = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params

        const wblType = await WBL_types.findByPk(id)
        if (!wblType) {
            res.status(404).json({ error: "WBL type not found" })
            return
        }

        await wblType.destroy()

        res.status(204).send()
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to delete WBL type" })
    }
}

export const insertStudentWBLHours = async (req: Request, res: Response): Promise<void> => {
    try {
        const { student_id, wbl_type_id, hours, notes } = req.body

        await Student_WBL.create({
            student_id,
            wbl_type_id,
            hours,
            notes,
            recorded_at: new Date(),
        })

        res.status(201).json({ message: "WBL hours added successfully" })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to delete WBL type" })
    }
}

export const getStudentWBLHours = async (req: Request, res: Response): Promise<void> => {
    try {
        const { student_id } = req.params

        const wblHours = await Student_WBL.findAll({
            where: { student_id },
            include: [{ model: WBL_types, as: "wbl_type" }],
        })

        res.status(200).json(wblHours)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to retrieve WBL hours" })
    }
}

export const updateStudentWBLHours = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params
        const { hours, notes } = req.body

        const wblHours = await Student_WBL.findByPk(id)
        if (!wblHours) {
            res.status(404).json({ error: "WBL hours not found" })
            return
        }

        await wblHours.update({ hours, notes })

        res.status(200).json(wblHours)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to update WBL hours" })
    }
}

export const deleteStudentWBLHours = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params

        const wblHours = await Student_WBL.findByPk(id)
        if (!wblHours) {
            res.status(404).json({ error: "WBL hours not found" })
            return
        }

        await wblHours.destroy()

        res.status(204).send()
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to delete WBL hours" })
    }
}
