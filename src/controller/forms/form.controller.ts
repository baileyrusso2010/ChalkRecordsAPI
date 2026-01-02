import { Request, Response } from "express"
import { Op } from "sequelize"
import { Form } from "../../models/forms/form.model"
import { Enrollment } from "../../models/enrollment.model"
import { ClassForm } from "../../models/forms/class_forms.model"
import { StudentFormSubmission } from "../../models/forms/student_form_submissions.model"
import { StudentFormSubmissionData } from "../../models/forms/student_form_submission_data.model"
import { FormSection } from "../../models/forms/form_sections.model"
import { FormField } from "../../models/forms/form_fields.model"

// List all forms
export async function listForms(req: Request, res: Response) {
    try {
        const forms = await Form.findAll({})
        res.json(forms)
    } catch (err: any) {
        console.error("Error listing forms", err)
        res.status(500).json({ error: "Failed to list forms", details: err.message })
    }
}

// Get single form
export async function getForm(req: Request, res: Response) {
    const { formId } = req.params
    const { advanced } = req.query
    try {
        const form = await Form.findByPk(formId, {
            include: advanced
                ? [
                      {
                          model: FormSection,
                          as: "form_sections",
                          include: [
                              {
                                  model: FormField,
                                  as: "form_fields",
                              },
                          ],
                      },
                  ]
                : [],
        })
        if (!form) return res.status(404).json({ error: "Form not found" })
        res.json(form)
    } catch (err) {
        console.error("Error fetching form", err)
        res.status(500).json({ error: "Failed to fetch form" })
    }
}

// Create new form
export async function createForm(req: Request, res: Response) {
    try {
        const form = await Form.create(req.body)
        res.status(201).json(form)
    } catch (err) {
        console.error("Error creating form", err)
        res.status(500).json({ error: "Failed to create form" })
    }
}

// Update form
export async function updateForm(req: Request, res: Response) {
    const { formId } = req.params
    try {
        const form = await Form.findByPk(formId)
        if (!form) return res.status(404).json({ error: "Form not found" })
        await form.update(req.body)
        res.json(form)
    } catch (err) {
        console.error("Error updating form", err)
        res.status(500).json({ error: "Failed to update form" })
    }
}

// Delete form
export async function deleteForm(req: Request, res: Response) {
    const { formId } = req.params
    try {
        const form = await Form.findByPk(formId)
        if (!form) return res.status(404).json({ error: "Form not found" })
        await form.destroy()
        res.json({ success: true })
    } catch (err) {
        console.error("Error deleting form", err)
        res.status(500).json({ error: "Failed to delete form" })
    }
}

export async function createClassForm(req: Request, res: Response) {
    try {
        const classForm = await ClassForm.create(req.body)
        res.status(201).json(classForm)
    } catch (err) {
        console.error("Error creating class form", err)
        res.status(500).json({ error: "Failed to create class form" })
    }
}

export async function getClassForms(req: Request, res: Response) {
    try {
        //add where later
        const classForms = await ClassForm.findAll({})
        res.json(classForms)
    } catch (err: any) {
        console.error("Error listing class forms", err)
        res.status(500).json({ error: "Failed to list class forms", details: err.message })
    }
}

export async function createStudentFormSubmission(req: Request, res: Response) {
    try {
        const studentFormSubmission = await StudentFormSubmission.create(req.body)
        res.status(201).json(studentFormSubmission)
    } catch (err) {
        console.error("Error creating student form submission", err)
        res.status(500).json({ error: "Failed to create student form submission" })
    }
}

//get student form submission by id with related data
export async function getStudentFormSubmission(req: Request, res: Response) {
    const { formId, studentId } = req.params

    try {
        const studentFormSubmission = await StudentFormSubmission.findOne({
            where: {
                form_id: formId,
                student_id: studentId,
            },
            include: [
                {
                    model: StudentFormSubmissionData,
                    as: "data",
                },
            ],
        })
        if (!studentFormSubmission)
            return res.status(404).json({ error: "Student form submission not found" })
        res.json(studentFormSubmission)
    } catch (err) {
        console.error("Error fetching student form submission", err)
        res.status(500).json({ error: "Failed to fetch student form submission" })
    }
}

export async function insertStudentFormSubmissionData(req: Request, res: Response) {
    const { submissionId } = req.params
    try {
        const [studentFormSubmissionData] = await StudentFormSubmissionData.upsert({
            ...req.body,
            submission_id: submissionId,
        })
        res.status(200).json(studentFormSubmissionData)
    } catch (err) {
        console.error("Error upserting student form submission data", err)
        res.status(500).json({ error: "Failed to upsert student form submission data" })
    }
}
