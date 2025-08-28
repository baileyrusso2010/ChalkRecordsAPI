import { Request, Response } from "express"
import { Flag } from "../models/flag.model"
import { FlagParticipation } from "../models/flag_participation.model"

export const getFlags = async (req: Request, res: Response) => {
    try {
        const results = await Flag.findAll({})

        return res.status(200).json(results)
    } catch (err) {
        console.error("getFlags error", err)
        return res.status(500).json({ error: "Internal server error" })
    }
}

export const createFlag = async (req: Request, res: Response) => {
    try {
        const { name, description, color } = req.body
        if (!name || !description) {
            return res.status(400).json({ error: "name and description are required" })
        }
        if (color && !/^#[0-9A-Fa-f]{6}$/.test(color)) {
            return res.status(400).json({ error: "color must be a valid hex (#RRGGBB)" })
        }
        const created = await Flag.create({ name, description, color })
        return res.status(201).json(created)
    } catch (err: any) {
        console.error("createFlag error", err)
        return res.status(500).json({ error: "Internal server error" })
    }
}
export const editFlag = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const { name, description, color } = req.body
        const payload: any = {}
        if (name !== undefined) payload.name = name
        if (description !== undefined) payload.description = description
        if (color !== undefined) {
            if (color && !/^#[0-9A-Fa-f]{6}$/.test(color)) {
                return res.status(400).json({ error: "color must be a valid hex (#RRGGBB)" })
            }
            payload.color = color
        }
        if (!Object.keys(payload).length) {
            return res.status(400).json({ error: "No valid fields provided" })
        }
        const [updated] = await Flag.update(payload, { where: { id } })
        if (updated === 0) return res.status(404).json({ error: "Flag not found" })
        const flag = await Flag.findByPk(id)
        return res.json(flag)
    } catch (err: any) {
        console.error("editFlag error", err)
        return res.status(500).json({ error: "Internal server error" })
    }
}

export const deleteFlag = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const deleted = await Flag.destroy({ where: { id } })
        if (deleted === 0) {
            return res.status(404).json({ error: "Flag not found" })
        }
        return res.status(204).send()
    } catch (err: any) {
        console.error("deleteFlag error", err)
        return res.status(500).json({ error: "Internal server error" })
    }
}

export const getStudentFlags = async (req: Request, res: Response) => {
    try {
        const results = await FlagParticipation.findAll({
            include: [
                {
                    model: Flag,
                    as: "flag",
                },
            ],
            where: {
                studentId: req.params.studentId,
            },
        })

        return res.status(200).json(results)
    } catch (err) {
        console.error("getFlags error", err)
        return res.status(500).json({ error: "Internal server error" })
    }
}

export const createStudentFlag = async (req: Request, res: Response) => {
    try {
        const created = await FlagParticipation.create({
            studentId: req.body.studentId,
            flagId: req.body.flagId,
            notes: req.body.notes,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
        })

        return res.status(201).json(created)
    } catch (err: any) {
        console.error("insertGrade error", err)
        return res.status(500).json({ error: "Internal server error" })
    }
}
export const editStudentFlag = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const [updated] = await FlagParticipation.update(
            {
                notes: req.body.notes,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
            },
            { where: { id } }
        )
        if (updated === 0) {
            return res.status(404).json({ error: "Student flag participation not found" })
        }
        const participation = await FlagParticipation.findByPk(id)
        return res.json(participation)
    } catch (err: any) {
        console.error("editStudentFlag error", err)
        return res.status(500).json({ error: "Internal server error" })
    }
}

export const deleteStudentFlag = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const deleted = await FlagParticipation.destroy({ where: { id } })
        if (deleted === 0) {
            return res.status(404).json({ error: "Flag not found" })
        }
        return res.status(204).send()
    } catch (err: any) {
        console.error("deleteFlag error", err)
        return res.status(500).json({ error: "Internal server error" })
    }
}
