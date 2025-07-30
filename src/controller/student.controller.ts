import { Request, Response } from "express"
import { Op } from "sequelize"
import { Student } from "../models/student.model"
import { ClassStudents } from "../models/class_students.model"
import { Program } from "../models/program.model"
import { Class } from "../models/classes.model"
import { StudentFlags } from "../models/student_flags.model"
import { Attendance } from "../models/attendance.model"
import { Staff } from "../models/staff.model"

export const searchStudent = async (req: Request, res: Response): Promise<void> => {
    const search = (req.query.search as string) || ""

    try {
        const students = await Student.findAll({
            where: {
                [Op.or]: [
                    { last_name: { [Op.iLike]: `%${search}%` } },
                    { first_name: { [Op.iLike]: `%${search}%` } },
                    { student_id: { [Op.iLike]: `%${search}%` } },
                ],
            },
            limit: 10,
        })

        res.status(200).json(students)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to obtain attendance" })
    }
}

export const getStudent = async (req: Request, res: Response): Promise<void> => {
    const id = (req.params.id as string) || ""

    try {
        const student = await Student.findByPk(id, {
            include: [
                {
                    model: ClassStudents,
                    include: [
                        {
                            model: Class,
                            include: [
                                {
                                    model: Program,
                                    attributes: ["name"],
                                },
                            ],
                            attributes: ["programId"],
                        },
                    ],
                    attributes: ["class_id"],
                },
            ],
        })

        res.status(200).json(student)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to obtain student" })
    }
}

export const getStudentsInClass = async (req: Request, res: Response): Promise<void> => {
    const id = (req.params.id as string) || ""

    try {
        // Simple query to get class info
        const classInfo = await Class.findByPk(id, {
            include: [
                { model: Program, attributes: ["name"] },
                {
                    model: Staff,
                    attributes: ["first_name", "last_name", "email"], // adjust attributes as needed
                },
            ],
            attributes: ["id", "name"],
        })

        console.log(classInfo)

        if (!classInfo) {
            res.status(404).json({ error: "Class not found" })
            return
        }

        // Simple query to get students in this class
        const classStudents = await ClassStudents.findAll({
            where: { class_id: id },
            include: [
                {
                    model: Student,
                    attributes: [
                        "id",
                        "firstName",
                        "lastName",
                        "student_id",
                        "gender",
                        "race",
                        "grade",
                    ],
                    include: [
                        {
                            model: Attendance,
                            as: "attendance", // Use the alias defined in associations
                            attributes: ["absences", "absenses_unexcused", "absenses_excused"],
                        },
                    ],
                },
            ],
            attributes: ["school_year"],
        })

        const response = {
            class: {
                id: classInfo.id,
                name: classInfo.name,
                teacher: {
                    firstName: (classInfo as any).Staff?.first_name,
                    lastName: (classInfo as any).Staff?.last_name,
                    email: (classInfo as any).Staff?.email,
                },
                program: (classInfo as any).Program?.name,
                schoolYear: classStudents.length > 0 ? classStudents[0].school_year : null,
            },
            students: classStudents.map((cs: any) => ({
                id: cs.Student.id,
                firstName: cs.Student.firstName,
                lastName: cs.Student.lastName,
                studentId: cs.Student.student_id,
                gender: cs.Student.gender,
                race: cs.Student.race,
                grade: cs.Student.grade,
                attendance:
                    cs.Student.attendance?.map((a: any) => ({
                        absences: a.absences,
                        absensesUnexcused: a.absenses_unexcused,
                        absensesExcused: a.absenses_excused,
                    })) || [],
            })),
        }

        res.status(200).json(response)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to obtain class students" })
    }
}
