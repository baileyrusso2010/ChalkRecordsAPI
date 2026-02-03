import { Request, Response } from "express"
import { Op } from "sequelize"
import sequelize from "../../database"
import { Behavior } from "../../models/behavior/behavior.model"
import { BehaviorType } from "../../models/behavior/behavior_type.model"
import { Student } from "../../models/student.model"
import { Staff } from "../../models/users/staff.model"

export const getAllBehaviors = async (req: Request, res: Response) => {
    try {
        const behaviors = await Behavior.findAll({
            include: [
                { model: BehaviorType, as: "behavior_type" },
                {
                    model: Student,
                    as: "student",
                    attributes: ["id", "first_name", "last_name"],
                },
                {
                    model: Staff,
                    as: "staff",
                    attributes: ["id", "first_name", "last_name"],
                },
            ],
        })
        res.status(200).json(behaviors)
    } catch (error) {
        console.error("Error fetching behaviors:", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const getBehaviorById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const behavior = await Behavior.findByPk(id, {
            include: [
                { model: BehaviorType, as: "behavior_type" },
                {
                    model: Student,
                    as: "student",
                    attributes: ["id", "first_name", "last_name"],
                },
                {
                    model: Staff,
                    as: "staff",
                    attributes: ["id", "first_name", "last_name"],
                },
            ],
        })

        if (!behavior) {
            return res.status(404).json({ error: "Behavior record not found" })
        }

        res.status(200).json(behavior)
    } catch (error) {
        console.error("Error fetching behavior:", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const getBehaviorsByStudentId = async (req: Request, res: Response) => {
    try {
        const { studentId } = req.params
        const behaviors = await Behavior.findAll({
            where: { student_id: studentId },
            include: [
                { model: BehaviorType, as: "behavior_type" },
                {
                    model: Staff,
                    as: "staff",
                    attributes: ["id", "first_name", "last_name"],
                },
            ],
        })
        res.status(200).json(behaviors)
    } catch (error) {
        console.error("Error fetching student behaviors:", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const getBehaviorAnalytics = async (req: Request, res: Response) => {
    try {
        const { groupBy, startDate, endDate, studentId, schoolId, grade } = req.query

        const whereClause: any = {}
        const studentWhereClause: any = {}

        // 1. Add Filters
        if (studentId) whereClause.student_id = studentId
        if (startDate && endDate) {
            whereClause.date = {
                [Op.between]: [new Date(startDate as string), new Date(endDate as string)],
            }
        }

        if (schoolId) studentWhereClause.school_id = schoolId
        if (grade) studentWhereClause.grade = grade

        // 2. Determine Grouping Logic
        const include: any[] = []
        const groupColumn: string[] = []
        const attributes: any[] = [
            [
                sequelize.cast(sequelize.fn("COUNT", sequelize.col("Behavior.id")), "integer"),
                "count",
            ],
        ]

        const groups = ((groupBy as string) || "").split(",")

        groups.forEach((group) => {
            switch (group) {
                case "month":
                    attributes.push([
                        sequelize.fn("DATE_TRUNC", "month", sequelize.col("date")),
                        "time_period",
                    ])
                    groupColumn.push("time_period")
                    break
                case "week":
                    attributes.push([
                        sequelize.fn("DATE_TRUNC", "week", sequelize.col("date")),
                        "time_period",
                    ])
                    groupColumn.push("time_period")
                    break
                case "year":
                    attributes.push([
                        sequelize.fn("DATE_TRUNC", "year", sequelize.col("date")),
                        "time_period",
                    ])
                    groupColumn.push("time_period")
                    break
                case "student":
                    include.push({
                        model: Student,
                        as: "student",
                        attributes: ["first_name", "last_name"],
                        where:
                            Object.keys(studentWhereClause).length > 0
                                ? studentWhereClause
                                : undefined,
                    })
                    groupColumn.push(
                        "Behavior.student_id",
                        "student.id",
                        "student.first_name",
                        "student.last_name",
                    )
                    break
                case "type":
                    include.push({
                        model: BehaviorType,
                        as: "behavior_type",
                        attributes: ["name"],
                    })
                    groupColumn.push(
                        "Behavior.behavior_type_id",
                        "behavior_type.id",
                        "behavior_type.name",
                    )
                    break
                default:
                    break
            }
        })

        // If we have student filters (school or grade) but NOT grouping by student, we still need to include the model to filter
        const hasStudentGroup = groups.includes("student")
        if (!hasStudentGroup && Object.keys(studentWhereClause).length > 0) {
            include.push({
                model: Student,
                as: "student",
                attributes: [],
                where: studentWhereClause,
            })
        }

        // 3. Execute Query
        const data = await Behavior.findAll({
            where: whereClause,
            attributes: attributes,
            include: include,
            group: groupColumn.length > 0 ? groupColumn : undefined,
            order: [[sequelize.literal("count"), "DESC"]],
            raw: true,
            nest: true,
        })

        res.status(200).json(data)
    } catch (error) {
        console.error("Error fetching analytics:", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}
