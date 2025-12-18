import { Request, Response } from "express"
import { Op } from "sequelize"
import { District_Program } from "../../models/program/district_program.model"
import { Course_Instance } from "../../models/course/course_instance.model"
import { Enrollment } from "../../models/enrollment.model"
import { Student } from "../../models/student.model"
import { StudentFlag } from "../../models/flags/student_flags.model"
import { Flag } from "../../models/flags/flag.model"
import { School } from "../../models/school/school.model"
import { Staff } from "../../models/staff.model"

// GET /program-catalogs

export async function getStudent(req: Request, res: Response) {
    try {
        const id = req.params.id

        const data = await Student.findByPk(id)

        res.json(data)
    } catch (err) {
        console.error("Error listing students", err)
        res.status(500).json({ error: "Failed to list student catalogs" })
    }
}

export async function getStudentDetail(req: Request, res: Response) {
    try {
        const id = req.params.id

        const student = await Student.findByPk(id, {
            include: [
                {
                    model: School,
                    as: "school",
                },
                {
                    model: Enrollment,
                    as: "enrollments",
                    include: [
                        {
                            model: Course_Instance,
                            as: "course_instance",
                            include: [
                                {
                                    model: Staff,
                                    as: "instructor",
                                },
                            ],
                        },
                    ],
                },
            ],
        })

        if (!student) {
            return res.status(404).json({ error: "Student not found" })
        }

        res.json(student)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to get student details" })
    }
}

export async function getStudents(req: Request, res: Response) {
    try {
        const data = await Student.findAll({})
        res.status(200).json(data)
    } catch (err) {
        console.error("Error listing students", err)
        res.status(500).json({ error: "Failed to list student catalogs" })
    }
}

export async function listStudents(req: Request, res: Response) {
    try {
        const { programId, flagId } = req.query as {
            programId?: string
            flagId?: string
        }

        const where: any = {}

        if (programId) where.program_id = programId
        if (flagId) where.flag_id = flagId

        //will need to include cte school later
        const results = await Student.findAll({
            include: [
                {
                    model: Enrollment,
                    as: "enrollments",
                    include: [
                        {
                            model: Course_Instance,
                            as: "course_instance",
                            include: [
                                {
                                    model: District_Program,
                                    as: "district_program",
                                    where: programId ? { id: programId } : undefined,
                                    required: !!programId,
                                },
                            ],
                        },
                    ],
                },
                {
                    model: StudentFlag,
                    attributes: ["id"],
                    include: [
                        {
                            model: Flag,
                            attributes: ["id", "name"],
                            where: flagId ? { id: flagId } : undefined,
                            required: !!flagId,
                        },
                    ],
                },
            ],
        })

        res.json(results)
    } catch (err) {
        console.error("Error listing students", err)
        res.status(500).json({ error: "Failed to list student catalogs" })
    }
}
