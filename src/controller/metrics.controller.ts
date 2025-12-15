import { Request, Response } from "express"
import { Op, Sequelize } from "sequelize"
import { Attendance } from "../models/attendance.model"
import { Score } from "../models/assessments/assessments.model"
import { Intervention } from "../models/mtss.model" // Adjust path if needed

export async function getMetrics(req: Request, res: Response) {
    try {
        const { metric, level, filters = {}, startDate, endDate } = req.body
        let model
        let group: string[] = []
        let where: any = {}

        // 1. Pick model
        switch (metric) {
            case "attendance":
                model = Attendance
                break
            case "assessment":
                model = Score
                break
            case "mtss":
                model = Intervention
                break
            default:
                return res.status(400).json({ error: "Invalid metric" })
        }

        // 2. Determine group by
        switch (level) {
            case "school":
                group = ["schoolId"]
                break
            case "grade":
                group = ["schoolId", "grade"]
                break
            case "class":
                group = ["schoolId", "grade", "classId"]
                break
            case "student":
                group = ["studentId"]
                break
            default:
                return res.status(400).json({ error: "Invalid level" })
        }

        // 3. Apply filters
        if (filters.schoolId) where.schoolId = filters.schoolId
        if (filters.grade) where.grade = filters.grade
        if (filters.classId) where.classId = filters.classId
        if (filters.studentId) where.studentId = filters.studentId
        if (startDate && endDate) where.date = { [Op.between]: [startDate, endDate] }

        // 4. Define aggregation
        let attributes
        switch (metric) {
            case "attendance":
                attributes = [...group, [Sequelize.fn("AVG", Sequelize.col("percent")), "value"]]
                break
            case "assessment":
                attributes = [...group, [Sequelize.fn("AVG", Sequelize.col("score")), "value"]]
                break
            case "mtss":
                attributes = [...group, [Sequelize.fn("COUNT", Sequelize.col("id")), "value"]]
                break
        }

        // 5. Query
        const results = await model.findAll({
            attributes,
            where,
            group,
        })

        res.json(results)
    } catch (err) {
        console.error("Error getting metrics", err)
        res.status(500).json({ error: "Failed to get metrics" })
    }
}
