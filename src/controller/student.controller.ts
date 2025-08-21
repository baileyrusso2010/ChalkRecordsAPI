import { Request, Response } from "express"
import { Op, fn, col, where } from "sequelize"
import { Enrollment } from "../models/enrollment.model"
import { Student } from "../models/students.model"

export const getStudentsInClass = async (req: Request, res: Response) => {
    const classId = req.params.classId
    try {
        const enrollments = await Enrollment.findAll({
            include: [
                {
                    model: Student,
                    as: "student",
                },
            ],
            where: { classId: classId },
        })

        const students = enrollments.map((e) => (e as any).student)

        res.status(200).json(students)
    } catch (err) {
        console.error(err)
        res.status(500).send({ error: "Internal server error" })
    }
}

export const findStudents = async (req: Request, res: Response) => {
    try {
        const { name } = req.query
        const searchTerm = (typeof name === "string" ? name : "").toLowerCase()

        const students = await Student.findAll({
            where: {
                [Op.or]: [
                    {
                        [Op.and]: where(fn("LOWER", col("last_name")), {
                            [Op.like]: `%${searchTerm}%`,
                        }),
                    },
                    {
                        [Op.and]: where(fn("LOWER", col("first_name")), {
                            [Op.like]: `%${searchTerm}%`,
                        }),
                    },
                ],
            },
        })
        res.status(200).json(students)
    } catch (err) {
        console.error(err)
        res.status(500).send({ error: "Internal server error" })
    }
}

export const enrollStudent = async (req: Request, res: Response) => {
    //it will be body
    console.log(req.body)
    try {
        await Enrollment.create({
            studentId: req.body.studentId,
            classId: req.body.classId,
            schoolYearId: 1,
        })

        res.status(201).json({ message: "Student enrolled successfully" })
    } catch (err) {
        console.error(err)
        res.status(500).send({ error: "Internal server error" })
    }
}

export const removeEnrollment = async (req: Request, res: Response) => {
    const id = req.params.id
    try {
        const deleted = await Enrollment.destroy({
            where: { id },
        })

        if (deleted) {
            res.status(200).json({ message: "Enrollment removed successfully" })
        } else {
            res.status(404).json({ error: "Enrollment not found" })
        }
    } catch (e) {
        console.error(e)
        res.status(500).send({ error: "Internal server error" })
    }
}
