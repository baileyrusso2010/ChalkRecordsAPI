import { Request, Response } from "express"
import { Op } from "sequelize"
import { Student } from "../models/student.model"
import { ClassStudents } from "../models/class_students.model"
import { Program } from "../models/program.model"
import { Class } from "../models/classes.model"
import { StudentFlags } from "../models/student_flags.model"
import { Attendance } from "../models/attendance.model"
import { Staff } from "../models/staff.model"
import { Grades } from "../models/grades.model"
import { TechnicalAssessment } from "../models/technical_assessment.model"

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
                {
                    model: Grades,
                    as: "grades", // Use the alias defined in associations
                    attributes: ["junior_grade", "senior_grade"],
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

        if (!classInfo) {
            res.status(404).json({ error: "Class not found" })
            return
        }

        const classStudents = await Student.findAll({
            include: [
                {
                    model: ClassStudents,
                    // as: "class_students", // Ensure this matches the alias in your association if set
                    where: { class_id: id },
                    attributes: ["school_year"],
                },
                {
                    model: Grades,
                    as: "grades", // Use the alias defined in associations
                    attributes: ["junior_grade", "senior_grade"],
                },
                {
                    model: Attendance,
                    as: "attendance",
                    attributes: ["absences", "absenses_unexcused", "absenses_excused"],
                },
                {
                    model: TechnicalAssessment,
                    as: "technical_assessment",
                    attributes: ["jr_sem_1", "jr_sem_2", "sr_sem_1", "sr_sem_2"],
                },
            ],
            attributes: ["id", "firstName", "lastName", "student_id"],
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
                schoolYear:
                    classStudents.length > 0 && (classStudents[0] as any).ClassStudents.length > 0
                        ? (classStudents[0] as any).ClassStudents[0].school_year
                        : null,
            },
            students: classStudents.map((student: any) => ({
                id: student.id,
                firstName: student.firstName,
                lastName: student.lastName,
                studentId: student.student_id,
                techAssessment: {
                    jrSem1: student.technical_assessment?.jr_sem_1,
                    jrSem2: student.technical_assessment?.jr_sem_2,
                    srSem1: student.technical_assessment?.sr_sem_1,
                    srSem2: student.technical_assessment?.sr_sem_2,
                },
                grades: {
                    juniorGrade: student.grades?.junior_grade,
                    seniorGrade: student.grades?.senior_grade,
                },
                attendance:
                    student.attendance?.map((a: any) => ({
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
