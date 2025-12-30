import { Request, Response } from "express"
import { Op } from "sequelize"
import sequelize from "../../database"
import { Attendance_Daily } from "../../models/attendance/attendance_daily.model"
import { Attendance_Status } from "../../models/attendance/attendance_status.model"
import { Student } from "../../models/student.model"

export const getAttendanceAnalytics = async (req: Request, res: Response) => {
    try {
        const { groupBy, startDate, endDate, studentId } = req.query

        const whereClause: any = {}

        // 1. Add Filters
        if (studentId) whereClause.student_id = studentId
        if (startDate && endDate) {
            whereClause.attendance_date = {
                [Op.between]: [new Date(startDate as string), new Date(endDate as string)],
            }
        }

        let groupAttribute: any
        let include: any[] = []
        let groupColumn: string[] = []

        // 2. Determine Grouping Logic
        switch (groupBy) {
            case "month":
                // Postgres specific: truncate date to month
                groupAttribute = [
                    sequelize.fn("DATE_TRUNC", "month", sequelize.col("attendance_date")),
                    "time_period",
                ]
                include = [
                    {
                        model: Attendance_Status,
                        as: "attendance_status",
                        attributes: ["code"],
                    },
                ]
                groupColumn = [
                    "time_period",
                    "attendance_status.id",
                    "attendance_status.code",
                    "Attendance_Daily.attendance_status_id",
                ]
                break
            case "week":
                groupAttribute = [
                    sequelize.fn("DATE_TRUNC", "week", sequelize.col("attendance_date")),
                    "time_period",
                ]
                include = [
                    {
                        model: Attendance_Status,
                        as: "attendance_status",
                        attributes: ["code"],
                    },
                ]
                groupColumn = [
                    "time_period",
                    "attendance_status.id",
                    "attendance_status.code",
                    "Attendance_Daily.attendance_status_id",
                ]
                break
            case "year":
                groupAttribute = [
                    sequelize.fn("DATE_TRUNC", "year", sequelize.col("attendance_date")),
                    "time_period",
                ]
                include = [
                    {
                        model: Attendance_Status,
                        as: "attendance_status",
                        attributes: ["code"],
                    },
                ]
                groupColumn = [
                    "time_period",
                    "attendance_status.id",
                    "attendance_status.code",
                    "Attendance_Daily.attendance_status_id",
                ]
                break
            case "student":
                groupAttribute = "student.id"
                include = [
                    {
                        model: Student,
                        as: "student",
                        attributes: ["first_name", "last_name"],
                    },
                ]
                groupColumn = [
                    "Attendance_Daily.student_id",
                    "student.id",
                    "student.first_name",
                    "student.last_name",
                ]
                break
            case "type":
            case "status":
                groupAttribute = "attendance_status.code"
                include = [
                    {
                        model: Attendance_Status,
                        as: "attendance_status",
                        attributes: ["code", "description"],
                    },
                ]
                groupColumn = [
                    "Attendance_Daily.attendance_status_id",
                    "attendance_status.id",
                    "attendance_status.code",
                    "attendance_status.description",
                ]
                break
            default:
                // Default to simple count
                return res.status(400).json({ error: "Invalid or missing groupBy parameter" })
        }

        const attributes: any[] = [
            [
                sequelize.cast(
                    sequelize.fn("COUNT", sequelize.col("Attendance_Daily.id")),
                    "integer"
                ),
                "count",
            ],
        ]

        if (Array.isArray(groupAttribute)) {
            attributes.push(groupAttribute)
        }

        // 3. Execute Query
        const data = await Attendance_Daily.findAll({
            where: whereClause,
            attributes: attributes,
            include: include,
            group: groupColumn,
            order: [[sequelize.literal("count"), "DESC"]],
            raw: true,
            nest: true,
        })

        res.status(200).json(data)
    } catch (error) {
        console.error("Error fetching attendance analytics:", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}
