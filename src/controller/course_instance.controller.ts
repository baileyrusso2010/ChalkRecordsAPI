import { Request, Response } from "express";
import { Op } from "sequelize";
import { Course_Instance } from "../models/course/course_instance.model";
import { Course_Catalog } from "../models/course/course_catalog.model";
import { Program_Catalog } from "../models/program/program_catalog.model";
import { CTE_School } from "../models/school/cte_school.model";
import { School_Year } from "../models/term/school_year.model";
import { Term } from "../models/term/term.model";
import { Staff } from "../models/staff.model";
import { Enrollment } from "../models/enrollment.model";
import { Student } from "../models/student.model";
import { StudentFlag } from "../models/flags/student_flags.model";
import { Flag } from "../models/flags/flag.model";
import { CTE_District_Program } from "../models/program/cte_district_program.model";

// GET /course-instances
// Query params: schoolId, programCatalogId, courseCatalogId, schoolYearId, termId, from, to
export async function listCourseInstances(req: Request, res: Response) {
  try {
    const { schoolId, programCatalogId, courseCatalogId, schoolYearId } =
      req.query as any;
    const where: any = {};
    if (schoolId) where.cte_school_id = schoolId;
    if (programCatalogId) where.district_program_id = programCatalogId;
    if (courseCatalogId) where.course_catalog_id = courseCatalogId;
    if (schoolYearId) where.school_year_id = schoolYearId;

    const results = await Course_Instance.findAll({
      where,
      include: [
        { model: Course_Catalog, as: "course_catalog" },
        { model: Program_Catalog, as: "program_catalog" },
        { model: School_Year, as: "school_year" },
        { model: Staff, as: "instructor" },
        { model: CTE_School, as: "cte_school" },
        { model: Enrollment, as: "enrollments" },
      ],
      order: [["id", "ASC"]],
    });

    const grouped: any = {};

    for (const course of results) {
      const schoolName = (course as any).cte_school?.name || "Unknown";
      const enrollmentCount = (course as any).enrollments?.length || 0;

      // Convert to plain object and add enrollmentCount
      const courseData = {
        ...course.toJSON(),
        enrollmentCount,
      };

      if (!grouped[schoolName]) grouped[schoolName] = [];
      grouped[schoolName].push(courseData);
    }

    res.json(grouped);
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
        {
          model: Enrollment,
          as: "enrollments",
          include: [{ model: Student, as: "student" }],
        },
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
      district_program_id: program_catalog_id ?? record.district_program_id,
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

//stats

export async function getCourseStats(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0)
      return res.status(400).json({ error: "Invalid id" });

    //this is good because then you can filter by teacher

    const records = await CTE_District_Program.findAll({
      include: [
        {
          model: Course_Instance,
          as: "course_instances",
          include: [
            {
              model: Enrollment,
              as: "enrollments",
              include: [
                {
                  model: Student,
                  as: "student", // Assuming association name; adjust if different
                  attributes: ["grade", "gender", "age"], // Include flags; add more attributes as needed
                  include: [
                    {
                      model: Flag, //date range for prev years
                      as: "flags",
                      through: { attributes: [] },
                    },
                  ],
                },
              ],
            },

            { model: School_Year, as: "school_year" }, // Include year for "each year" context
          ],
        },
      ],

      where: { program_id: id },
    });

    let totalStudentCount = 0;
    let totalFlags: { [key: string]: number } = {};
    let totalGenders: { [key: string]: number } = {};

    let byYear: {
      [year: number]: {
        totalStudents: number;
        totalFlags: { [key: string]: number };
        totalGenders: { [key: string]: number };
        byGrade: {
          [grade: string]: {
            students: number;
            flags: { [key: string]: number };
            gender: { [key: string]: number };
          };
        };
      };
    } = {};

    (records[0] as any).course_instances.forEach((_records: any) => {
      const year = _records.school_year.label.split("-")[1];

      if (!byYear[year]) {
        byYear[year] = {
          totalStudents: 0,
          totalFlags: {},
          totalGenders: {},
          byGrade: {},
        };

        _records.enrollments.forEach((record: any) => {
          totalStudentCount++;
          byYear[year].totalStudents++;
          const grade = record.student.grade;

          if (!byYear[year].byGrade[grade]) {
            byYear[year].byGrade[grade] = {
              students: 0,
              flags: {},
              gender: {},
            };
          }
          byYear[year].byGrade[grade].students++;

          const _gender = record.student.gender;
          if (_gender) {
            totalGenders[_gender] = (totalGenders[_gender] || 0) + 1;
            byYear[year].byGrade[grade].gender[_gender] =
              (byYear[year].byGrade[grade].gender[_gender] || 0) + 1;
            byYear[year].totalGenders[_gender] =
              (byYear[year].totalGenders[_gender] || 0) + 1;
          }

          for (const flag of record.student.flags) {
            const flagName = flag.name;
            totalFlags[flagName] = (totalFlags[flagName] || 0) + 1;
            byYear[year].byGrade[grade].flags[flagName] =
              (byYear[year].byGrade[grade].flags[flagName] || 0) + 1;

            byYear[year].totalFlags[flagName] =
              (byYear[year].totalFlags[flagName] || 0) + 1;
          }
        });
      }
    });

    // res.status(200).json(records)

    res.json({
      totalStudentCount,
      totalFlags,
      totalGenders,
      byYear,
    });
  } catch (err) {
    console.error("Error get course instance", err);
    res.status(500).json({ error: "Failed to get course instance stats" });
  }
}

//graphql
