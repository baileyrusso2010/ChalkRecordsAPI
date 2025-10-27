import { Request, Response } from "express"
import { Op } from "sequelize"
import { Form } from "../models/forms/form.model"
import { v4 as uuidv4 } from "uuid"
import { StudentFormResponses } from "../models/forms/student_form_responses.model"

// GET /student_form/:id
export async function getStudentAnswers(req: Request, res: Response) {
    try {
        const studentId = req.params.studentId

        const results = await StudentFormResponses.findAll({
            where: { student_id: studentId },
        })

        res.json(results)
    } catch (err) {
        console.error("Failed to get forms", err)
        res.status(500).json({ error: "Failed to get forms" })
    }
}

export async function saveStudentForm(req: Request, res: Response) {
    try {
        const { formId, studentId } = req.params
        const { responses } = req.body

        const [record, created] = await StudentFormResponses.upsert({
            form_id: formId,
            student_id: studentId,
            responses,
        })

        res.status(200).json({
            message: "Updated/Inserted",
            record,
        })
    } catch (err) {
        console.error("Failed to save forms", err)
        res.status(500).json({ error: "Failed to save" })
    }
}
