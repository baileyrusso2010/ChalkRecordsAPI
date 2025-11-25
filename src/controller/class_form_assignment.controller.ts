import { Request, Response } from "express"
import { ClassFormAssignment } from "../models/forms/class_form_assignment.model"
import { StudentForm } from "../models/student_form.model"
import { Enrollment } from "../models/enrollment.model"
import { Course_Instance } from "../models/course/course_instance.model"
import { Form } from "../models/forms/form.model"
import { Term } from "../models/term/term.model"

// Create class form assignment and assign to all enrolled students
export async function createClassFormAssignment(req: Request, res: Response) {
    try {
        const { class_id, form_id, assigned_at, due_date, status } = req.body

        // Create the assignment
        const assignment = await ClassFormAssignment.create({
            class_id,
            form_id,
            assigned_at: assigned_at || new Date(),
            due_date,
            status: status || "active",
        })

        // Get all enrolled students in the class
        const enrollments = await Enrollment.findAll({
            where: { course_instance_id: class_id },
            attributes: ["student_id"],
        })

        // Create student_form entries
        const studentForms = enrollments.map((enrollment) => ({
            student_id: enrollment.student_id,
            form_id,
            class_form_assignment_id: assignment.id,
        }))

        await StudentForm.bulkCreate(studentForms, { ignoreDuplicates: true })

        res.status(201).json({
            assignment,
            studentFormsCreated: studentForms.length,
        })
    } catch (err) {
        console.error("Error creating class form assignment", err)
        res.status(500).json({ error: "Failed to create class form assignment" })
    }
}

// List all class form assignments
export async function listClassFormAssignments(req: Request, res: Response) {
    try {
        const assignments = await ClassFormAssignment.findAll({
            include: [
                { model: Course_Instance, as: "course_instance" },
                { model: Form, as: "form" },
                { model: Term, as: "term" },
            ],
            order: [["assigned_at", "DESC"]],
        })
        res.json(assignments)
    } catch (err) {
        console.error("Error listing class form assignments", err)
        res.status(500).json({ error: "Failed to list class form assignments" })
    }
}

// Get assignments by class
export async function getAssignmentsByClass(req: Request, res: Response) {
    const { classId } = req.params
    try {
        const assignments = await ClassFormAssignment.findAll({
            where: { class_id: classId },
            include: [
                { model: Form, as: "form" },
                { model: Term, as: "term" },
            ],
            order: [["assigned_at", "DESC"]],
        })
        res.json(assignments)
    } catch (err) {
        console.error("Error fetching assignments by class", err)
        res.status(500).json({ error: "Failed to fetch assignments by class" })
    }
}

// Get single assignment
export async function getClassFormAssignment(req: Request, res: Response) {
    const { id } = req.params
    try {
        const assignment = await ClassFormAssignment.findByPk(id, {
            include: [
                { model: Course_Instance, as: "course_instance" },
                { model: Form, as: "form" },
                { model: Term, as: "term" },
            ],
        })
        if (!assignment) return res.status(404).json({ error: "Assignment not found" })
        res.json(assignment)
    } catch (err) {
        console.error("Error fetching assignment", err)
        res.status(500).json({ error: "Failed to fetch assignment" })
    }
}

// Update assignment
export async function updateClassFormAssignment(req: Request, res: Response) {
    const { id } = req.params
    try {
        const assignment = await ClassFormAssignment.findByPk(id)
        if (!assignment) return res.status(404).json({ error: "Assignment not found" })
        await assignment.update(req.body)
        res.json(assignment)
    } catch (err) {
        console.error("Error updating assignment", err)
        res.status(500).json({ error: "Failed to update assignment" })
    }
}

// Delete assignment
export async function deleteClassFormAssignment(req: Request, res: Response) {
    const { id } = req.params
    try {
        const assignment = await ClassFormAssignment.findByPk(id)
        if (!assignment) return res.status(404).json({ error: "Assignment not found" })
        await assignment.destroy()
        res.json({ success: true })
    } catch (err) {
        console.error("Error deleting assignment", err)
        res.status(500).json({ error: "Failed to delete assignment" })
    }
}
