import { Request, Response } from "express";
import { Op } from "sequelize";
import { Form } from "../models/forms/form.model";
import { v4 as uuidv4 } from "uuid";
import { StudentForm } from "../models/student_form.model";
import { Student } from "../models/student.model";

export async function assignForms(req: Request, res: Response) {
  try {
    const assignments = req.body; // array of {studentId, formId}

    if (!Array.isArray(assignments)) {
      return res.status(400).json({ error: "Assignments must be an array" });
    }

    const records = await StudentForm.bulkCreate(
      assignments.map((a: any) => ({
        student_id: a.studentId,
        form_id: a.formId,
      })),
      { ignoreDuplicates: true }
    );

    res.status(201).json({
      message: "Forms assigned successfully",
      records,
    });
  } catch (err) {
    console.error("Failed to assign forms", err);
    res.status(500).json({ error: "Failed to assign forms" });
  }
}

export async function getStudentForms(req: Request, res: Response) {
  try {
    const { studentId } = req.params;

    const student = await Student.findByPk(studentId, {
      include: [
        {
          model: Form,
          as: "forms",
          through: { attributes: [] }, // exclude junction table attributes
        },
      ],
    });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(student.forms);
  } catch (err) {
    console.error("Failed to get student forms", err);
    res.status(500).json({ error: "Failed to get student forms" });
  }
}
