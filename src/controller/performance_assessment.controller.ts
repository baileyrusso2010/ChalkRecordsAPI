import { Request, Response } from "express"
import { Op } from "sequelize"
import { PerformanceAssessment } from "../models/performance_assessment.mode"

export const insertTechnicalAssessment = async (req: Request, res: Response): Promise<void> => {
    try {
        const ta = await PerformanceAssessment.create({
            student_id: req.body.student_id,
            jr_sem_1: req.body.jr_sem_1,
            jr_sem_2: req.body.jr_sem_2,
            sr_sem_1: req.body.sr_sem_1,
            sr_sem_2: req.body.sr_sem_2,
        })

        res.status(201).json(ta)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to obtain attendance" })
    }
}

export const getTechnicalAssessment = async (req: Request, res: Response): Promise<void> => {
    const student_id = (req.params.studentId as string) || ""

    try {
        const ta = await PerformanceAssessment.findOne({ where: { student_id: student_id } })

        if (!ta) {
            res.status(404).json({ error: "Technical Assessment not found" })
            return
        }

        res.status(200).json(ta)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to obtain technical assessment" })
    }
}

//it has one student_id so it should be unique
//but down line we may need to break this up in sub models
export const updateTechnicalAssessment = async (req: Request, res: Response): Promise<void> => {
    const student_id = (req.params.studentId as string) || ""

    try {
        const ta = await PerformanceAssessment.findOne({ where: { student_id: student_id } })

        if (!ta) {
            res.status(404).json({ error: "Technical Assessment not found" })
            return
        }

        await ta.update({
            jr_sem_1: req.body.jr_sem_1,
            jr_sem_2: req.body.jr_sem_2,
            sr_sem_1: req.body.sr_sem_1,
            sr_sem_2: req.body.sr_sem_2,
        })

        res.status(200).json(ta)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to update technical assessment" })
    }
}

export const deleteTechnicalAssessment = async (req: Request, res: Response): Promise<void> => {
    try {
        const ta = await PerformanceAssessment.findByPk(req.params.id)

        if (!ta) {
            res.status(404).json({ error: "Technical Assessment not found" })
            return
        }

        await ta.destroy()

        res.status(204).send()
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to delete technical assessment" })
    }
}
