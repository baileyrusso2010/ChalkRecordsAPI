import { Request, Response } from "express"
import { Op } from "sequelize"
import { Form } from "../../models/forms/form.model"
import { v4 as uuidv4 } from "uuid"
import { StudentForm } from "../../models/student_form.model"
import { Student } from "../../models/student.model"
import { ClassFormAssignment } from "../../models/forms/class_form_assignment.model"
import { Course_Instance } from "../../models/course/course_instance.model"
import { Term } from "../../models/term/term.model"
import { Enrollment } from "../../models/enrollment.model"

export async function assignForms(req: Request, res: Response) {
    try {
        const assignments = req.body // array of {studentId, formId}

        if (!Array.isArray(assignments)) {
            return res.status(400).json({ error: "Assignments must be an array" })
        }

        const records = await StudentForm.bulkCreate(
            assignments.map((a: any) => ({
                student_id: a.studentId,
                form_id: a.formId,
            })),
            { ignoreDuplicates: true }
        )

        res.status(201).json({
            message: "Forms assigned successfully",
            records,
        })
    } catch (err) {
        console.error("Failed to assign forms", err)
        res.status(500).json({ error: "Failed to assign forms" })
    }
}

export async function getStudentForms(req: Request, res: Response) {
    try {
        const { studentId } = req.params

        const studentForms = await StudentForm.findAll({
            where: { student_id: studentId },
            include: [
                {
                    model: Form,
                    as: "form",
                },
                {
                    model: ClassFormAssignment,
                    as: "class_form_assignment",
                    include: [
                        { model: Course_Instance, as: "course_instance" },
                        { model: Term, as: "term" },
                    ],
                },
            ],
        })

        res.json(studentForms)
    } catch (err) {
        console.error("Failed to get student forms", err)
        res.status(500).json({ error: "Failed to get student forms" })
    }
}

export async function assignFormToCourse(req: Request, res: Response) {
    try {
        const { courseId, formId, dueDate } = req.body

        if (!courseId || !formId) {
            return res.status(400).json({ error: "courseId and formId are required" })
        }

        // 1. Create ClassFormAssignment
        const assignment = await ClassFormAssignment.create({
            class_id: courseId,
            form_id: formId,
            due_date: dueDate,
            assigned_at: new Date(),
            status: "active",
        })

        // 2. Find all students in the course
        const enrollments = await Enrollment.findAll({
            where: { course_instance_id: courseId },
        })

        if (enrollments.length === 0) {
            return res.status(201).json({
                message: "Form assigned to course, but no students found to assign.",
                assignment,
            })
        }

        // 3. Create StudentForm records
        const studentFormsData = enrollments.map((enrollment: any) => ({
            student_id: enrollment.student_id,
            form_id: formId,
            class_form_assignment_id: assignment.id,
            complete: false,
        }))

        await StudentForm.bulkCreate(studentFormsData, { ignoreDuplicates: true })

        res.status(201).json({
            message: `Form assigned to course and ${studentFormsData.length} students.`,
            assignment,
            studentCount: studentFormsData.length,
        })
    } catch (err) {
        console.error("Failed to assign form to course", err)
        res.status(500).json({ error: "Failed to assign form to course" })
    }
}
