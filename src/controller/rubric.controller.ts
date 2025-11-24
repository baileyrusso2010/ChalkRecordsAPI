// List columns for a section
export async function listRubricColumns(req: Request, res: Response) {
  const { sectionId } = req.params;
  try {
    const columns = await Rubric_Columns.findAll({
      where: { rubric_section_id: sectionId },
      order: [["id", "ASC"]],
    });
    res.json(columns);
  } catch (err) {
    console.error("Error listing rubric columns", err);
    res.status(500).json({ error: "Failed to list rubric columns" });
  }
}
import { Request, Response } from "express";
import { Rubric_Rows } from "../models/forms/rubric_rows.model";
import { Rubric_Columns } from "../models/forms/rubric_columns.model";
import { Rubric_Sections } from "../models/forms/rubric_sections.model";
import { Rubric_Grades } from "../models/forms/rubric_grades.model";

// Sections CRUD
export async function listRubricSections(req: Request, res: Response) {
  const { formId } = req.params;
  try {
    const sections = await Rubric_Sections.findAll({
      where: { form_id: formId },
      order: [["id", "ASC"]],
    });
    res.json(sections);
  } catch (err) {
    console.error("Error listing rubric sections", err);
    res.status(500).json({ error: "Failed to list rubric sections" });
  }
}

export async function listRubricRows(req: Request, res: Response) {
  const { sectionId } = req.params; // or use formId if you want all rows for a form
  try {
    const rows = await Rubric_Rows.findAll({
      where: { rubric_section_id: sectionId },
      order: [["id", "ASC"]],
    });
    res.json(rows);
  } catch (err) {
    console.error("Error listing rubric rows", err);
    res.status(500).json({ error: "Failed to list rubric rows" });
  }
}

export async function createRubricSection(req: Request, res: Response) {
  try {
    const section = await Rubric_Sections.create(req.body);
    res.status(201).json(section);
  } catch (err) {
    console.error("Error creating rubric section", err);
    res.status(500).json({ error: "Failed to create rubric section" });
  }
}

export async function updateRubricSection(req: Request, res: Response) {
  const { sectionId } = req.params;
  try {
    const section = await Rubric_Sections.findByPk(sectionId);
    if (!section) return res.status(404).json({ error: "Section not found" });
    await section.update(req.body);
    res.json(section);
  } catch (err) {
    console.error("Error updating rubric section", err);
    res.status(500).json({ error: "Failed to update rubric section" });
  }
}

export async function deleteRubricSection(req: Request, res: Response) {
  const { sectionId } = req.params;
  try {
    const section = await Rubric_Sections.findByPk(sectionId);
    if (!section) return res.status(404).json({ error: "Section not found" });
    await section.destroy();
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting rubric section", err);
    res.status(500).json({ error: "Failed to delete rubric section" });
  }
}

// Rows CRUD
export async function createRubricRow(req: Request, res: Response) {
  try {
    const row = await Rubric_Rows.create(req.body);
    res.status(201).json(row);
  } catch (err) {
    console.error("Error creating rubric row", err);
    res.status(500).json({ error: "Failed to create rubric row" });
  }
}

export async function updateRubricRow(req: Request, res: Response) {
  const { rowId } = req.params;
  try {
    const row = await Rubric_Rows.findByPk(rowId);
    if (!row) return res.status(404).json({ error: "Row not found" });
    await row.update(req.body);
    res.json(row);
  } catch (err) {
    console.error("Error updating rubric row", err);
    res.status(500).json({ error: "Failed to update rubric row" });
  }
}

export async function deleteRubricRow(req: Request, res: Response) {
  const { rowId } = req.params;
  try {
    const row = await Rubric_Rows.findByPk(rowId);
    if (!row) return res.status(404).json({ error: "Row not found" });
    await row.destroy();
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting rubric row", err);
    res.status(500).json({ error: "Failed to delete rubric row" });
  }
}

// Columns CRUD (similar pattern)
export async function createRubricColumn(req: Request, res: Response) {
  try {
    const col = await Rubric_Columns.create(req.body);
    res.status(201).json(col);
  } catch (err) {
    console.error("Error creating rubric column", err);
    res.status(500).json({ error: "Failed to create rubric column" });
  }
}

export async function updateRubricColumn(req: Request, res: Response) {
  const { columnId } = req.params;
  try {
    const col = await Rubric_Columns.findByPk(columnId);
    if (!col) return res.status(404).json({ error: "Column not found" });
    await col.update(req.body);
    res.json(col);
  } catch (err) {
    console.error("Error updating rubric column", err);
    res.status(500).json({ error: "Failed to update rubric column" });
  }
}

export async function deleteRubricColumn(req: Request, res: Response) {
  const { columnId } = req.params;
  try {
    const col = await Rubric_Columns.findByPk(columnId);
    if (!col) return res.status(404).json({ error: "Column not found" });
    await col.destroy();
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting rubric column", err);
    res.status(500).json({ error: "Failed to delete rubric column" });
  }
}

// Grades CRUD
export async function saveRubricGrades(req: Request, res: Response) {
  const { grades } = req.body;
  try {
    for (const g of grades) {
      await Rubric_Grades.upsert({
        rubric_row_id: g.row_id,
        rubric_column_id: g.column_id,
        period: g.period,
        grade: g.grade,
        comment: g.comment,
        student_id: req.params.studentId,
      });
    }
    res.json({ success: true });
  } catch (err) {
    console.error("Error saving grades", err);
    res.status(500).json({ error: "Failed to save grades" });
  }
}

// Fetch grades for a student
export async function getRubricGrades(req: Request, res: Response) {
  const { studentId, formId } = req.params;
  try {
    const grades = await Rubric_Grades.findAll({
      where: { student_id: studentId },
      include: [
        {
          model: Rubric_Rows,
          as: "rubric_row",
          include: [{ model: Rubric_Sections, as: "rubric_section" }],
        },
        { model: Rubric_Columns, as: "rubric_column" },
      ],
      order: [
        [{ model: Rubric_Rows, as: "rubric_row" }, "id", "ASC"],
        [{ model: Rubric_Columns, as: "rubric_column" }, "id", "ASC"],
      ],
    });
    res.json(grades);
  } catch (err) {
    console.error("Error fetching rubric grades", err);
    res.status(500).json({ error: "Failed to fetch rubric grades" });
  }
}
