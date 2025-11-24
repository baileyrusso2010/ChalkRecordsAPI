import { Request, Response } from "express";
import { Op } from "sequelize";
import { Form } from "../models/forms/form.model";
import { Rubric_Grades } from "../models/forms/rubric_grades.model";
import { Rubric_Rows } from "../models/forms/rubric_rows.model";
import { Rubric_Sections } from "../models/forms/rubric_sections.model";
import { Rubric_Columns } from "../models/forms/rubric_columns.model";

// List all forms
export async function listForms(req: Request, res: Response) {
  try {
    const forms = await Form.findAll({ order: [["createdAt", "DESC"]] });
    res.json(forms);
  } catch (err) {
    console.error("Error listing forms", err);
    res.status(500).json({ error: "Failed to list forms" });
  }
}

// Get single form
export async function getForm(req: Request, res: Response) {
  const { formId } = req.params;
  try {
    const form = await Form.findByPk(formId);
    if (!form) return res.status(404).json({ error: "Form not found" });
    res.json(form);
  } catch (err) {
    console.error("Error fetching form", err);
    res.status(500).json({ error: "Failed to fetch form" });
  }
}

// Create new form
export async function createForm(req: Request, res: Response) {
  try {
    const form = await Form.create(req.body);
    res.status(201).json(form);
  } catch (err) {
    console.error("Error creating form", err);
    res.status(500).json({ error: "Failed to create form" });
  }
}

// Update form
export async function updateForm(req: Request, res: Response) {
  const { formId } = req.params;
  try {
    const form = await Form.findByPk(formId);
    if (!form) return res.status(404).json({ error: "Form not found" });
    await form.update(req.body);
    res.json(form);
  } catch (err) {
    console.error("Error updating form", err);
    res.status(500).json({ error: "Failed to update form" });
  }
}

// Delete form
export async function deleteForm(req: Request, res: Response) {
  const { formId } = req.params;
  try {
    const form = await Form.findByPk(formId);
    if (!form) return res.status(404).json({ error: "Form not found" });
    await form.destroy();
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting form", err);
    res.status(500).json({ error: "Failed to delete form" });
  }
}
