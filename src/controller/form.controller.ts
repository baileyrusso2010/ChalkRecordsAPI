import { Request, Response } from "express";
import { Op } from "sequelize";
import { Form } from "../models/forms/form.model";
import { v4 as uuidv4 } from "uuid";

// Create a new form
export const createForm = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    console.log(description);
    const form = await Form.create({ name, description });
    res.status(201).json(form);
  } catch (error) {
    res.status(500).json({ error: "Failed to create form" });
  }
};

// Get all forms
export const getForms = async (req: Request, res: Response) => {
  try {
    const forms = await Form.findAll();
    res.json(forms);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve forms" });
  }
};

// Get a form by ID
export const getFormById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const form = await Form.findByPk(id);
    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }
    res.json(form);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve form" });
  }
};

// Update a form by ID
export const updateForm = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const [updated] = await Form.update(
      { name, description },
      { where: { id } }
    );
    if (!updated) {
      return res.status(404).json({ error: "Form not found" });
    }
    const updatedForm = await Form.findByPk(id);
    res.json(updatedForm);
  } catch (error) {
    res.status(500).json({ error: "Failed to update form" });
  }
};

// Delete a form by ID
export const deleteForm = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Form.destroy({ where: { id } });
    if (!deleted) {
      return res.status(404).json({ error: "Form not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete form" });
  }
};
