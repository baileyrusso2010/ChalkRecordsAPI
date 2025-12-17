import { Request, Response } from "express"
import { Op, Sequelize } from "sequelize"
import { Student_Assessment_Results } from "../../models/assessments/student_assessment_results.model"
import { Student } from "../../models/student.model"
import { Attendance } from "../../models/attendance.model"
import { Behavior } from "../../models/behavior/behavior.model"
import { BehaviorType } from "../../models/behavior/behavior_type.model"

export async function getMetrics(req: Request, res: Response) {
    try {
        const { filters = {}, startDate, endDate, level = "school", metric } = req.body

        const model = getModel(metric)
        const studentWhere = getStudentWhere(filters)
        const where = getWhere(metric, filters, startDate, endDate)
        const group = getGroup(metric, level)
        const attributes = getAttributes(metric, level)
        const include = getInclude(metric, studentWhere)

        const results = await model.findAll({
            attributes,
            where,
            group,
            include,
            raw: true,
        })

        res.json(results)
    } catch (err) {
        console.error("Error getting metrics", err)
        res.status(500).json({ error: "Failed to get metrics" })
    }
}

function getModel(metric: string) {
    switch (metric) {
        case "assessment":
            return Student_Assessment_Results
        case "attendance":
            return Attendance
        case "behavior":
            return Behavior
        default:
            throw new Error("Invalid metric")
    }
}

function getStudentWhere(filters: any) {
    const studentWhere: any = {}
    if (filters.cte_school_id && filters.cte_school_id !== "All Schools") {
        studentWhere.cte_school_id = filters.cte_school_id
    }
    if (filters.grade) {
        studentWhere.grade = filters.grade
    }
    return studentWhere
}

function getWhere(metric: string, filters: any, startDate: any, endDate: any) {
    const where: any = {}
    if (filters.student_id) {
        where.student_id = filters.student_id
    }

    if (startDate && endDate) {
        if (metric === "attendance") {
            where.attendance_date = { [Op.between]: [startDate, endDate] }
        } else if (metric === "assessment") {
            where.taken_at = { [Op.between]: [startDate, endDate] }
        } else if (metric === "behavior") {
            where.date = { [Op.between]: [startDate, endDate] }
        }
    }
    return where
}

function getGroup(metric: string, level: string) {
    if (metric === "behavior") {
        switch (level) {
            case "school":
                return [
                    Sequelize.col("student.cte_school_id"),
                    Sequelize.col("student->cte_school.name"),
                    Sequelize.col("behavior_type.name"),
                ]
            case "grade":
                return [
                    Sequelize.col("student.cte_school_id"),
                    Sequelize.col("student->cte_school.name"),
                    Sequelize.col("student.grade"),
                    Sequelize.col("behavior_type.name"),
                ]
            case "student":
                return [Sequelize.col("student_id"), Sequelize.col("behavior_type.name")]
            default:
                throw new Error("Invalid level for behavior")
        }
    }

    switch (level) {
        case "school":
            return [
                Sequelize.col("student.cte_school_id"),
                Sequelize.col("student->cte_school.name"),
            ]
        case "grade":
            return [
                Sequelize.col("student.cte_school_id"),
                Sequelize.col("student->cte_school.name"),
                Sequelize.col("student.grade"),
            ]
        case "student":
            return [Sequelize.col("student_id"), Sequelize.col("student->cte_school.name")]
        default:
            throw new Error("Invalid level")
    }
}

function getAttributes(metric: string, level: string) {
    const attributes: any[] = []

    if (metric === "behavior") {
        switch (level) {
            case "school":
                attributes.push([Sequelize.col("student.cte_school_id"), "cte_school_id"])
                attributes.push([Sequelize.col("student->cte_school.name"), "cte_school_name"])
                attributes.push([Sequelize.col("behavior_type.name"), "behavior_type"])
                break
            case "grade":
                attributes.push([Sequelize.col("student.cte_school_id"), "cte_school_id"])
                attributes.push([Sequelize.col("student->cte_school.name"), "cte_school_name"])
                attributes.push([Sequelize.col("behavior_type.name"), "behavior_type"])
                attributes.push([Sequelize.col("student.grade"), "grade"])
                break
            case "student":
                attributes.push([Sequelize.col("student_id"), "student_id"])
                attributes.push([Sequelize.col("behavior_type.name"), "behavior_type"])
                break
        }
        attributes.push([Sequelize.fn("COUNT", Sequelize.col("Behavior.id")), "incident_count"])
        return attributes
    }

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
        attributes.push([
            Sequelize.literal(
                '(SUM(CASE WHEN "Attendance".code = \'P\' THEN 1 ELSE 0 END) * 100.0 / NULLIF(COUNT("Attendance".id), 0))'
            ),
            "value",
        ])
    } else if (metric === "assessment") {
        attributes.push([Sequelize.fn("AVG", Sequelize.col("percent_score")), "value"])
    }

    return attributes
}

function getInclude(metric: string, studentWhere: any) {
    if (metric === "behavior") {
        return [
            {
                model: BehaviorType,
                as: "behavior_type",
                attributes: [],
                required: false,
            },
            {
                model: Student,
                as: "student",
                attributes: [],
                where: studentWhere,
                required: false,
                include: [
                    {
                        association: "cte_school",
                        attributes: [],
                        required: false,
                    },
                ],
            },
        ]
    }

    return [
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
    ]
}

export async function getBehaviorGrouping(req: Request, res: Response) {
    try {
        const { filters = {}, startDate, endDate } = req.body
        const studentWhere = getStudentWhere(filters)
        const where = getWhere("behavior", filters, startDate, endDate)

        const results = await Behavior.findAll({
            attributes: [
                [Sequelize.col("behavior_type.name"), "behavior_type"],
                [Sequelize.fn("COUNT", Sequelize.col("Behavior.id")), "incident_count"],
            ],
            where,
            include: [
                {
                    model: BehaviorType,
                    as: "behavior_type",
                    attributes: [],
                    required: true,
                },
                {
                    model: Student,
                    as: "student",
                    attributes: [],
                    where: studentWhere,
                    required: Object.keys(studentWhere).length > 0,
                },
            ],
            group: [Sequelize.col("behavior_type.name")],
            raw: true,
        })

        res.json(results)
    } catch (err) {
        console.error("Error getting behavior grouping", err)
        res.status(500).json({ error: "Failed to retrieve behavior grouping" })
    }
}

export async function getDashboardSummary(req: Request, res: Response) {
    try {
        let student_count = await Student.count()

        res.json({
            attendance_rate: 92.2,
            behavior_incident_count: 17,
            enrollment: 325,
        })
    } catch (e) {
        console.error("Error getting metric grouping", e)
        res.status(500).json({ error: "Failed to retrieve behavior grouping" })
    }
}
