import { Request, Response } from "express"
import { Op } from "sequelize"
import { Student } from "../models/student.model"
import { ClassStudents } from "../models/class_students.model"
import { Program } from "../models/program.model"
import { Class } from "../models/classes.model"

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
        const classStudents = await ClassStudents.findAll({
            where: { class_id: id },
            include: [
                {
                    model: Student,
                    attributes: ["id", "firstName", "lastName", "student_id"],
                },
                {
                    model: Class,
                    include: [
                        {
                            model: Program,
                            attributes: ["name"],
                        },
                    ],
                    attributes: ["id"],
                },
            ],
        })

        res.status(200).json(classStudents)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to obtain class student" })
    }
}
