import { Request, Response } from "express";
import Form_Static_Fields from "../models/forms/form_static_fields";
import Form_Static_Values from "../models/forms/form_static_values";

// List fields for a form
export async function listStaticFields(req: Request, res: Response) {
  const { formId } = req.params;
  try {
    const fields = await Form_Static_Fields.findAll({
      where: { form_id: formId },
      order: [["id", "ASC"]],
    });
    res.json(fields);
  } catch (err) {
    console.error("Error listing static fields", err);
    res.status(500).json({ error: "Failed to list static fields" });
  }
}

// Create field
export async function createStaticField(req: Request, res: Response) {
  try {
    const payload = Array.isArray(req.body) ? req.body : [req.body];

    const normalized = payload.map((item) => ({
      form_id: item.form_id,
      field_name: item.field_name,
      field_type: item.field_type,
      category: item.category,
    }));

    const hasMissing = normalized.some(
      (field) =>
        field.form_id === undefined ||
        field.form_id === null ||
        !field.field_name ||
        !field.field_type
    );

    if (hasMissing) {
      return res.status(400).json({
        error:
          "Each field must include form_id, field_name, and field_type values.",
      });
    }

    const created = await Form_Static_Fields.bulkCreate(normalized, {
      validate: true,
    });

    res.status(201).json(Array.isArray(req.body) ? created : created[0]);
  } catch (err) {
    console.error("Error creating static field", err);
    res.status(500).json({ error: "Failed to create static field, Correct" });
  }
}

// Update field
export async function updateStaticField(req: Request, res: Response) {
  const { fieldId } = req.params;
  try {
    const field = await Form_Static_Fields.findByPk(fieldId);
    if (!field) return res.status(404).json({ error: "Field not found" });
    await field.update(req.body);
    res.json(field);
  } catch (err) {
    console.error("Error updating static field", err);
    res.status(500).json({ error: "Failed to update static field" });
  }
}

// Delete field
export async function deleteStaticField(req: Request, res: Response) {
  const { fieldId } = req.params;
  try {
    const field = await Form_Static_Fields.findByPk(fieldId);
    if (!field) return res.status(404).json({ error: "Field not found" });
    await field.destroy();
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting static field", err);
    res.status(500).json({ error: "Failed to delete static field" });
  }
}

// Save static values for a student
export async function saveStaticValues(req: Request, res: Response) {
  const { studentId } = req.params;
  const { values } = req.body; // array of { fieldId, value }
  try {
    for (const v of values) {
      await Form_Static_Values.upsert({
        form_static_field: v.field_id,
        student_id: studentId,
        value: v.value,
      });
    }
    res.json({ success: true });
  } catch (err) {
    console.error("Error saving static values", err);
    res.status(500).json({ error: "Failed to save static values" });
  }
}

// Seed test static fields for quick verification
export async function seedStaticFields(req: Request, res: Response) {
  try {
    const sample = [
      {
        form_id: 11,
        field_name: "21st Century Exam Score",
        field_type: "number",
        category: "assessment",
      },
      {
        form_id: 11,
        field_name: "21st Century Cut Score",
        field_type: "number",
        category: "assessment",
      },
    ];

    const results = [] as Form_Static_Fields[];

    for (const record of sample) {
      const [instance] = await Form_Static_Fields.findOrCreate({
        where: {
          form_id: record.form_id,
          field_name: record.field_name,
        },
        defaults: record,
      });
      results.push(instance);
    }

    res.status(201).json({ records: results });
  } catch (err) {
    console.error("Error seeding static fields", err);
    res.status(500).json({ error: "Failed to seed static fields" });
  }
}
