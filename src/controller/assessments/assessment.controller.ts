import { Request, Response } from "express"
import { Op } from "sequelize"
import { Assessments } from "../../models/assessments/assessments.model"
import { Student_Assessment_Results } from "../../models/assessments/student_assessment_results.model"

//simple?
export async function getStudentAssessments(req: Request, res: Response) {
    const { student_id } = req.params

    try {
        const results = await Assessments.findAll({
            include: [
                {
                    model: Student_Assessment_Results,
                    as: "student_results",
                    where: { student_id: student_id },
                    required: true,
                    attributes: ["raw_score", "percent_score"],
                },
            ],
            attributes: ["id", "name"],
        })

        res.json(results)
    } catch (err) {
        console.error("Error getting assessments", err)
        res.status(500).json({ error: "Failed getting assessments" })
    }
}
