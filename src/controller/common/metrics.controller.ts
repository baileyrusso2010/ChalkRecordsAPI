import { Request, Response } from "express"
import { Op, Sequelize } from "sequelize"
import { Student_Assessment_Results } from "../../models/assessments/student_assessment_results.model"
import { Student } from "../../models/student.model"
import { Attendance } from "../../models/attendance.model"

export async function getMetrics(req: Request, res: Response) {
    try {
        const { filters = {}, startDate, endDate, level = "school", metric } = req.body
        let model
        let group = []
        let where: any = {}

        // 1. Pick model
        switch (metric) {
            case "assessment":
                model = Student_Assessment_Results
                break
            case "attendance":
                model = Attendance
                break
            default:
                throw new Error("Invalid metric")
        }

        switch (level) {
            case "school":
                group = [
                    Sequelize.col("student.cte_school_id"),
                    Sequelize.col("student->cte_school.name"),
                ]
                break
            case "grade":
                group = [
                    Sequelize.col("student.cte_school_id"),
                    Sequelize.col("student->cte_school.name"),
                    Sequelize.col("student.grade"),
                ]
                break
            case "class":
                //yet
                throw new Error("Class level not supported")
            case "student":
                group = [Sequelize.col("student_id"), Sequelize.col("student->cte_school.name")]
                break
            default:
                throw new Error("Invalid level")
        }

        // Adjust where based on metric
        const studentWhere: any = {}
        if (filters.cte_school_id && filters.cte_school_id !== "All Schools")
            studentWhere.cte_school_id = filters.cte_school_id
        if (filters.grade) studentWhere.grade = filters.grade
        // class_id not supported
        if (filters.student_id) where.student_id = filters.student_id
        if (metric === "attendance") {
            if (startDate && endDate) where.attendance_date = { [Op.between]: [startDate, endDate] }
        } else if (metric === "assessment") {
            if (startDate && endDate) where.taken_at = { [Op.between]: [startDate, endDate] }
        }

        // 4. Define aggregation
        let attributes: any[] = []
        switch (level) {
            case "school":
                attributes.push([Sequelize.col("student.cte_school_id"), "cte_school_id"])
                attributes.push([Sequelize.col("student->cte_school.name"), "cte_school_name"])
                break
            case "grade":
                attributes.push([Sequelize.col("student.cte_school_id"), "cte_school_id"])
                attributes.push([Sequelize.col("student->cte_school.name"), "cte_school_name"])
                attributes.push([Sequelize.col("student.grade"), "grade"])
                break
            case "student":
                attributes.push([Sequelize.col("student.cte_school_id"), "cte_school_id"])
                attributes.push([Sequelize.col("student->cte_school.name"), "cte_school_name"])
                attributes.push([Sequelize.col("student_id"), "student_id"])
                break
        }
        if (metric === "attendance") {
            // Calculate percent present based on code column: 'P' = present, 'A' = absent
            attributes.push([
                Sequelize.literal(
                    '(SUM(CASE WHEN "Attendance".code = \'P\' THEN 1 ELSE 0 END) * 100.0 / NULLIF(COUNT("Attendance".id), 0))'
                ),
                "value",
            ])
        } else if (metric === "assessment") {
            attributes.push([Sequelize.fn("AVG", Sequelize.col("percent_score")), "value"])
        }

        const results = await model.findAll({
            attributes,
            where,
            group,
            include: [
                {
                    model: Student,
                    as: "student",
                    attributes: [],
                    where: studentWhere,
                    required: true,
                    include: [
                        {
                            association: "cte_school",
                            attributes: [],
                            required: false,
                        },
                    ],
                },
            ],
            raw: true,
        })

        res.json(results)
    } catch (err) {
        console.error("Error getting metrics", err)
        res.status(500).json({ error: "Failed to get metrics" })
    }
}
