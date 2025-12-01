import { Request, Response } from "express";
import { readFileSync } from "fs";
import { PDFDocument, PDFForm } from "pdf-lib";
import { Skill } from "../models/skill.model";
import { SkillScore } from "../models/skill_score.model";
import { Student } from "../models/student.model";
import { Home_School } from "../models/school/home_school.model";
import { CTE_School } from "../models/school/cte_school.model";
import { Enrollment } from "../models/enrollment.model";
import { Course_Instance } from "../models/course/course_instance.model";
import { Staff } from "../models/staff.model";
import { Course_Catalog } from "../models/course/course_catalog.model";
import { WBL_Catagories } from "../models/wbl/wbl_catagories.model";
import { WBL_Hours } from "../models/wbl/wbl_hours.model";
import { Rubric_Sections } from "../models/forms/rubric_sections.model";
import { Rubric_Rows } from "../models/forms/rubric_rows.model";
import { Rubric_Columns } from "../models/forms/rubric_columns.model";
import { Rubric_Grades } from "../models/forms/rubric_grades.model";
import { Form_Static_Fields } from "../models/forms/form_static_fields";
import { Form_Static_Values } from "../models/forms/form_static_values";

// --- Constants ---
const TEMPLATE_PATH = "./Animal_Full.pdf";
const COHORT_YEAR = "2025-2026";
const SCHOOL_YEARS = "2024-2026";

// --- Main Controller ---

export async function generateStudentSkillsPdf(req: Request, res: Response) {
  try {
    const { studentId, categoryId } = req.params;
    const parsedStudentId = Number(studentId);

    // 1. Load PDF Template
    const pdfDoc = await loadPdfTemplate();
    const form = pdfDoc.getForm();

    // 2. Fetch Data
    const student = await fetchStudentData(parsedStudentId);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const [skills, wblRecords, rubricSection, staticFields, cdosFields] =
      await Promise.all([
        fetchSkills(parsedStudentId, categoryId),
        fetchWBLRecords(parsedStudentId),
        fetchRubricSection(parsedStudentId),
        fetchStaticFields(parsedStudentId),
        fetchRubricSectionCDOS(parsedStudentId),
      ]);

    fillCDOS(form, cdosFields);

    // Legacy Skill Fill (from Skill model)
    fillLegacySkills(form, skills);

    // Student Info
    fillStudentInfo(form, student);

    // WBL Data
    fillWBLData(form, wblRecords);

    // Rubric Data (Overwrites some skill fields)
    fillRubricData(form, rubricSection);

    // Static Fields
    fillStaticFieldData(form, staticFields);

    // 4. Finalize and Send
    form.flatten();
    const pdfBytes = await pdfDoc.save();
    sendPdfResponse(res, pdfBytes, studentId, categoryId);
  } catch (err) {
    console.error("Failed to generate PDF", err);
    return res.status(500).json({ error: "Failed to generate PDF" });
  }
}

// --- Data Fetching Helpers ---

async function loadPdfTemplate() {
  const existingPdfBytes = readFileSync(TEMPLATE_PATH);
  return await PDFDocument.load(existingPdfBytes);
}

async function fetchRubricSectionCDOS(studentId: number) {
  return await Rubric_Sections.findOne({
    where: { id: 1 }, // Magic number from original code
    include: [
      {
        model: Rubric_Rows,
        as: "rubric_rows",
        include: [
          {
            model: Rubric_Grades,
            as: "rubric_grades",
            where: { student_id: studentId },
            required: false,
          },
        ],
      },
      { model: Rubric_Columns, as: "rubric_columns" },
    ],
  });
}

async function fetchStudentData(studentId: number) {
  return await Student.findOne({
    where: { id: studentId },
    include: [
      { model: Home_School, as: "home_school" },
      { model: CTE_School, as: "cte_school" },
      {
        model: Enrollment,
        as: "enrollments",
        include: [
          {
            model: Course_Instance,
            as: "course_instance",
            include: [
              { model: Staff, as: "instructor" },
              { model: Course_Catalog, as: "course_catalog" },
            ],
          },
        ],
      },
    ],
  });
}

async function fetchSkills(studentId: number, categoryId: string) {
  return await Skill.findAll({
    include: {
      model: SkillScore,
      where: { student_id: studentId },
      required: false,
    },
    where: { category_id: categoryId, active: true },
  });
}

async function fetchWBLRecords(studentId: number) {
  return await WBL_Catagories.findAll({
    include: [
      {
        model: WBL_Hours,
        as: "wbl_hours",
        where: { student_id: studentId },
      },
    ],
  });
}

async function fetchRubricSection(studentId: number) {
  return await Rubric_Sections.findOne({
    where: { id: 2 }, // Magic number from original code
    include: [
      {
        model: Rubric_Rows,
        as: "rubric_rows",
        include: [
          {
            model: Rubric_Grades,
            as: "rubric_grades",
            where: { student_id: studentId },
            required: false,
          },
        ],
      },
      { model: Rubric_Columns, as: "rubric_columns" },
    ],
  });
}

async function fetchStaticFields(studentId: number) {
  return await Form_Static_Fields.findAll({
    where: { rubric_section_id: 3 }, // Magic number from original code
    include: [
      {
        model: Form_Static_Values,
        as: "static_values",
        where: { student_id: studentId },
        required: false,
      },
    ],
  });
}

// --- PDF Filling Helpers ---

function safeSetText(
  form: PDFForm,
  fieldName: string,
  value: string | number | null | undefined
) {
  try {
    const field = form.getTextField(fieldName);
    field.setText(value != null ? String(value) : "");
  } catch (e) {
    // Field might not exist in PDF, ignore
  }
}

function fillCDOS(form: PDFForm, section: any) {
  if (!section) return;

  const rows = (section as any).rubric_rows || [];
  const columns = (section as any).rubric_columns || [];

  rows.forEach((row: any, rowIndex: number) => {
    const indexSuffix = rowIndex + 1;
    safeSetText(form, `perf_${indexSuffix}`, row.label);
    safeSetText(form, `exp_${indexSuffix}`, row.description);

    columns.forEach((col: any, colIndex: number) => {
      const grade = row.rubric_grades?.find(
        (g: any) => g.rubric_column_id === col.id
      );

      const periodSuffixes = [
        "junior_sem1_",
        "junior_sem2_",
        "senior_sem1_",
        "senior_sem2_",
      ];
      const suffix = periodSuffixes[colIndex];

      if (suffix) {
        safeSetText(form, `${suffix}${indexSuffix}`, grade?.grade);
        if (grade?.comment) {
          safeSetText(form, `cdos_comments_${indexSuffix}`, grade.comment);
        }
      }
    });
  });
}

function fillLegacySkills(form: PDFForm, skills: any[]) {
  const data = skills.map((r) => r.toJSON());

  for (let i = 0; i < 17; i++) {
    const skillItem = data[i];
    const indexSuffix = i + 1;

    if (skillItem) {
      safeSetText(form, `Ind_Tech_Skill_.${indexSuffix}`, skillItem.title);
      safeSetText(
        form,
        `Ind_Tech_Expectation_.${indexSuffix}`,
        skillItem.description
      );

      const scores = Array.isArray(skillItem.SkillScores)
        ? skillItem.SkillScores
        : [];
      scores.forEach((s: any, j: number) => {
        safeSetText(form, `Tech_0${indexSuffix}_Jr_Sem_${j + 1}`, s.score);
        if (s.comment) {
          safeSetText(form, `COMMENTS_Tech_0${indexSuffix}`, s.comment);
        }
      });
    } else {
      safeSetText(form, `Ind_Tech_Expectation_.${indexSuffix}`, "");
      safeSetText(form, `Ind_Tech_Skill_.${indexSuffix}`, "");
    }
  }
}

function fillStudentInfo(form: PDFForm, studentModel: any) {
  const student = studentModel.toJSON();
  const enrollment = student.enrollments?.[0];
  const courseInstance = enrollment?.course_instance;
  const instructor = courseInstance?.instructor;

  safeSetText(form, "cte_program", courseInstance?.alias);
  safeSetText(
    form,
    "teacher_name",
    instructor ? `${instructor.first_name} ${instructor.last_name}` : ""
  );
  safeSetText(
    form,
    "student_name",
    `${student.first_name} ${student.last_name} `
  );
  safeSetText(form, "student_id", student.student_id);
  safeSetText(form, "cohort", COHORT_YEAR);
  safeSetText(form, "school_district", student.home_school?.name);
  safeSetText(form, "school_year", SCHOOL_YEARS);
  safeSetText(form, "cte_school", student.cte_school?.name);
}

function fillWBLData(form: PDFForm, wblRecords: any[]) {
  // Aggregate hours
  const wblSummaries = wblRecords.map((cat: any) => ({
    name: cat.name,
    totalHours: cat.wbl_hours.reduce(
      (sum: number, hour: any) => sum + (hour.hours || 0),
      0
    ),
  }));

  wblSummaries.forEach((summary, i) => {
    safeSetText(form, `wbl_type_${i + 1}`, summary.name);
    safeSetText(form, `wbl_total_${i + 1}`, summary.totalHours);
  });
}

function fillRubricData(form: PDFForm, section: any) {
  if (!section) return;

  const rows = (section as any).rubric_rows || [];
  const columns = (section as any).rubric_columns || [];

  rows.forEach((row: any, rowIndex: number) => {
    const indexSuffix = rowIndex + 1;
    safeSetText(form, `Ind_Tech_Skill_.${indexSuffix}`, row.label);
    safeSetText(form, `Ind_Tech_Expectation_.${indexSuffix}`, row.description);

    columns.forEach((col: any, colIndex: number) => {
      const grade = row.rubric_grades?.find(
        (g: any) => g.rubric_column_id === col.id
      );

      const periodSuffixes = ["Jr_Sem_1", "Jr_Sem_2", "Sr_Sem_1", "Sr_Sem_2"];
      const suffix = periodSuffixes[colIndex];

      if (suffix) {
        const rowStr = indexSuffix < 10 ? `0${indexSuffix}` : `${indexSuffix}`;
        safeSetText(form, `Tech_${rowStr}_${suffix}`, grade?.grade);
      }
    });
  });
}

function fillStaticFieldData(form: PDFForm, staticFields: any[]) {
  const getFieldVal = (name: string) => {
    const field = staticFields.find((f: any) => f.field_name === name);
    return (field as any)?.static_values?.[0]?.value ?? "";
  };

  safeSetText(form, "21_date", getFieldVal("Date"));
  safeSetText(form, "21_cut_score", getFieldVal("Cut Points"));
}

function sendPdfResponse(
  res: Response,
  pdfBytes: Uint8Array,
  studentId: string,
  categoryId: string
) {
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=student_${studentId}_category_${categoryId}.pdf`
  );
  res.send(Buffer.from(pdfBytes));
}
