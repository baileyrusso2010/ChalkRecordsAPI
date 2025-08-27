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
        const created = await Flag.create({
            name: req.body.name,
            description: req.body.description,
        })

        return res.status(201).json(created)
    } catch (err: any) {
        console.error("insertGrade error", err)
        return res.status(500).json({ error: "Internal server error" })
    }
}
export const editFlag = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const [updated] = await Flag.update(
            {
                name: req.body.name,
                description: req.body.description,
            },
            { where: { id } }
        )
        if (updated === 0) {
            return res.status(404).json({ error: "Flag not found" })
        }
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
            return res.status(404).json({ error: "Flag not update" })
        }
        const flag = await Flag.findByPk(id)
        return res.json(flag)
    } catch (err: any) {
        console.error("editFlag error", err)
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
