import { Request, Response } from "express";
import { Op } from "sequelize";
import { Course_Instance } from "../models/course/course_instance.model";
import { Course_Catalog } from "../models/course/course_catalog.model";
import { Program_Catalog } from "../models/program/program_catalog.model";
import { CTE_School } from "../models/school/cte_school.model";
import { School_Year } from "../models/term/school_year.model";
import { Term } from "../models/term/term.model";

// GET /course-instances
// Query params: schoolId, programCatalogId, courseCatalogId, schoolYearId, termId, from, to
export async function listCourseInstances(req: Request, res: Response) {
  try {
    const { schoolId, programCatalogId, courseCatalogId } = req.query as any;
    const where: any = {};
    if (schoolId) where.cte_school_id = schoolId;
    if (programCatalogId) where.program_catalog_id = programCatalogId;
    if (courseCatalogId) where.course_catalog_id = courseCatalogId;

    const results = await Course_Instance.findAll({
      where,
      include: [
        { model: Course_Catalog, as: "course_catalog" },
        { model: Program_Catalog, as: "program_catalog" },
      ],
      order: [["id", "ASC"]],
    });

    res.json(results);
  } catch (err) {
    console.error("Error listing course instances", err);
    res.status(500).json({ error: "Failed to list course instances" });
  }
}

// GET /course-instances/:id
export async function getCourseInstance(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0)
      return res.status(400).json({ error: "Invalid id" });

    const record = await Course_Instance.findByPk(id, {
      include: [
        { model: Course_Catalog, as: "course_catalog" },
        { model: Program_Catalog, as: "program_catalog" },
        { model: CTE_School, as: "cte_school" },
      ],
    });

    if (!record) return res.status(404).json({ error: "Not found" });
    res.json(record);
  } catch (err) {
    console.error("Error retrieving course instance", err);
    res.status(500).json({ error: "Failed to retrieve course instance" });
  }
}

// POST /course-instances
export async function createCourseInstance(req: Request, res: Response) {
  try {
    const {
      cte_school_id,
      program_catalog_id,
      course_catalog_id,
      instructorId,
      alias,
    } = req.body;

    const created = await Course_Instance.create({
      cte_school_id,
      district_program_id: program_catalog_id,
      course_catalog_id,
      instructorId,
      alias,
      // start_date: start_date ? new Date(start_date) : undefined, end_date: end_date ? new Date(end_date) : undefined,
    });

    res.status(201).json(created);
  } catch (err) {
    console.error("Error creating course instance", err);
    res.status(500).json({ error: "Failed to create course instance" });
  }
}

// PUT /course-instances/:id
export async function updateCourseInstance(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0)
      return res.status(400).json({ error: "Invalid id" });

    const record = await Course_Instance.findByPk(id);
    if (!record) return res.status(404).json({ error: "Not found" });

    const {
      cte_school_id,
      program_catalog_id,
      course_catalog_id,
      instructorId,
      start_date,
      end_date,
    } = req.body;

    await record.update({
      cte_school_id: cte_school_id ?? record.cte_school_id,
      district_program_id: program_catalog_id ?? record.program_catalog_id,
      course_catalog_id: course_catalog_id ?? record.course_catalog_id,
      instructorId: instructorId ?? record.instructorId,
      start_date:
        start_date !== undefined ? new Date(start_date) : record.start_date,
      end_date: end_date !== undefined ? new Date(end_date) : record.end_date,
    });

    res.json(record);
  } catch (err) {
    console.error("Error updating course instance", err);
    res.status(500).json({ error: "Failed to update course instance" });
  }
}

// DELETE /course-instances/:id
export async function deleteCourseInstance(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0)
      return res.status(400).json({ error: "Invalid id" });

    const record = await Course_Instance.findByPk(id);
    if (!record) return res.status(404).json({ error: "Not found" });

    await record.destroy();
    res.status(204).send();
  } catch (err) {
    console.error("Error deleting course instance", err);
    res.status(500).json({ error: "Failed to delete course instance" });
  }
}
