import { Request, Response } from "express"
import { Grade } from "../models/grade.model"
import { Assignment } from "../models/assignment.model"
import { Student } from "../models/students.model"

// Helper to standardize id parsing & 400 on invalid id
const parseId = (raw: string) => {
    const id = Number(raw)
    return Number.isInteger(id) && id > 0 ? id : null
}

export const insertGrade = async (req: Request, res: Response) => {
    try {
        if (!req.body) return res.status(400).json({ error: "Request body is missing" })
        const { studentId, assignmentId, score, pass_fail, letter } = req.body

        if (studentId === undefined || assignmentId === undefined || score === undefined) {
            return res.status(400).json({
                error: "Missing required fields: studentId, assignmentId, score",
            })
        }

        const created = await Grade.create({
            studentId,
            assignmentId,
            score,
            pass_fail,
            letter,
        })
        return res.status(201).json(created)
    } catch (err: any) {
        console.error("insertGrade error", err)
        return res.status(500).json({ error: "Internal server error" })
    }
}

export const getGrade = async (req: Request, res: Response) => {
    try {
        const id = parseId(req.params.id)
        if (!id) return res.status(400).json({ error: "Invalid id parameter" })
        const grade = await Grade.findByPk(id)
        if (!grade) return res.status(404).json({ error: "Grade not found" })
        return res.status(200).json(grade)
    } catch (err) {
        console.error("getGrade error", err)
        return res.status(500).json({ error: "Internal server error" })
    }
}

export const deleteGrade = async (req: Request, res: Response) => {
    try {
        const id = parseId(req.params.id)
        if (!id) return res.status(400).json({ error: "Invalid id parameter" })
        const deleted = await Grade.destroy({ where: { id } })
        if (!deleted) return res.status(404).json({ error: "Grade not found" })
        return res.status(200).json({ deleted: true, id })
    } catch (err) {
        console.error("deleteGrade error", err)
        return res.status(500).json({ error: "Internal server error" })
    }
}

export const updateGrade = async (req: Request, res: Response) => {
    try {
        const id = parseId(req.params.id)
        if (!id) return res.status(400).json({ error: "Invalid id parameter" })
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: "Request body is missing" })
        }

        const { studentId, assignmentId, score, pass_fail, letter } = req.body
        const [affected] = await Grade.update(
            { studentId, assignmentId, score, pass_fail, letter },
            { where: { id } }
        )
        if (!affected) return res.status(404).json({ error: "Grade not found" })
        const updated = await Grade.findByPk(id)
        return res.status(200).json(updated)
    } catch (err) {
        console.error("updateGrade error", err)
        return res.status(500).json({ error: "Internal server error" })
    }
}

export const getGradebook = async (req: Request, res: Response) => {
    try {
        const results = await Assignment.findAll({
            include: [
                {
                    model: Grade,
                    as: "grades",
                    include: [
                        {
                            model: Student,
                            as: "student",
                        },
                    ],
                },
            ],
            where: { courseId: req.params.courseId },
        })

        res.status(200).json(results)
    } catch (err) {
        console.error("updateGrade error", err)
        return res.status(500).json({ error: "Internal server error" })
    }
}

// Returns a matrix-friendly structure:
// {
//   courseId,
//   assignments: [ { id, name, max_score, weight, due_date } ],
//   students: [ { id, firstName, lastName } ],
//   rows: [ { studentId, studentName, grades: { [assignmentId]: { gradeId, score, pass_fail, letter } | null } } ]
// }
// This avoids repeating assignment metadata per row and is easy to render as a table.
export const getGradebookMatrix = async (req: Request, res: Response) => {
    try {
        const courseId = parseId(req.params.courseId)
        if (!courseId) return res.status(400).json({ error: "Invalid courseId parameter" })

        // Fetch assignments for the course with their grades & student relation
        const assignments = await Assignment.findAll({
            where: { courseId },
            include: [
                {
                    model: Grade,
                    as: "grades",
                    include: [{ model: Student, as: "student" }],
                },
            ],
            order: [["id", "ASC"]],
        })

        // Collect unique students from grades (alternative: join enrollment table if needed)
        const studentMap: Map<number, { id: number; firstName: string; lastName: string }> =
            new Map()
        assignments.forEach((a: any) => {
            a.grades?.forEach((g: any) => {
                if (g.student) {
                    studentMap.set(g.student.id, {
                        id: g.student.id,
                        firstName: g.student.firstName,
                        lastName: g.student.lastName,
                    })
                }
            })
        })

        const students = Array.from(studentMap.values()).sort((a, b) => {
            const lastCmp = a.lastName.localeCompare(b.lastName)
            return lastCmp !== 0 ? lastCmp : a.firstName.localeCompare(b.firstName)
        })

        // Build grade lookup: gradesByStudent[studentId][assignmentId] = grade
        const gradesByStudent: Record<string, Record<string, any>> = {}
        assignments.forEach((a: any) => {
            a.grades?.forEach((g: any) => {
                const sid = String(g.studentId)
                if (!gradesByStudent[sid]) gradesByStudent[sid] = {}
                gradesByStudent[sid][String(a.id)] = {
                    gradeId: g.id,
                    score: g.score,
                    pass_fail: g.pass_fail,
                    letter: g.letter,
                    updatedAt: g.updatedAt,
                }
            })
        })

        const rows = students.map((s) => {
            const gradeCells: Record<string, any> = {}
            assignments.forEach((a: any) => {
                gradeCells[a.id] = gradesByStudent[String(s.id)]?.[String(a.id)] || null
            })
            return {
                studentId: s.id,
                studentName: `${s.lastName}, ${s.firstName}`,
                grades: gradeCells,
            }
        })

        const response = {
            courseId,
            assignments: assignments.map((a: any) => ({
                id: a.id,
                name: a.name,
                max_score: a.max_score,
                weight: a.weight,
                due_date: a.due_date,
            })),
            students,
            rows,
            meta: {
                assignmentCount: assignments.length,
                studentCount: students.length,
                generatedAt: new Date().toISOString(),
            },
        }
        return res.status(200).json(response)
    } catch (err) {
        console.error("getGradebookMatrix error", err)
        return res.status(500).json({ error: "Internal server error" })
    }
}
