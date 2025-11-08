import { Request, Response } from "express";
import { fillForm } from "../utils/pdf/generate_test";
import { Skill } from "../models/skill.model";
import { SkillScore } from "../models/skill_score.model";
import { readFileSync } from "fs";
import { PDFDocument } from "pdf-lib";
import { Student } from "../models/student.model";

// Generates PDF for given student/category and streams it
export async function generateStudentSkillsPdf(req: Request, res: Response) {
  try {
    const { studentId, categoryId } = req.params;

    // Load template
    const existingPdfBytes = readFileSync("./Animal_Full.pdf");
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const form = pdfDoc.getForm();

    // Query data
    const results = await Skill.findAll({
      include: {
        model: SkillScore,
        where: { student_id: studentId },
        required: false,
      },
      where: { category_id: categoryId, active: true },
    });

    const data = results.map((r) => r.toJSON());

    // Basic fill (reuse existing logic idea)
    for (let i = 0; i < 17; i++) {
      const expFieldName = `Ind_Tech_Expectation_.${i + 1}`;
      const skillFieldName = `Ind_Tech_Skill_.${i + 1}`;
      try {
        const expField = form.getTextField(expFieldName);
        const skillField = form.getTextField(skillFieldName);
        expField.setText(data[i]?.title || "");
        skillField.setText("");
      } catch {}
    }

    for (let i = 0; i < data.length; i++) {
      try {
        const skillField = form.getTextField(`Ind_Tech_Skill_.${i + 1}`);
        skillField.setText(data[i].title || "");
        const expField = form.getTextField(`Ind_Tech_Expectation_.${i + 1}`);
        expField.setText(data[i].description || "");
        const commentField = form.getTextField(`COMMENTS_Tech_0${i + 1}`);
        const scores = Array.isArray(data[i].SkillScores)
          ? data[i].SkillScores
          : [];
        scores.forEach((s: any, j: number) => {
          try {
            const qtrField = form.getTextField(
              `Tech_0${i + 1}_Jr_Sem_${j + 1}`
            );
            qtrField.setText(s.score != null ? String(s.score) : "");
            if (s.comment) commentField.setText(s.comment);
          } catch {}
        });
      } catch {}
    }

    let _studentData = await Student.findAll({
      where: {
        id: studentId,
      },
    });

    const _data = _studentData.map((r) => r.toJSON());

    const studentName = form.getTextField("StudentName");
    studentName.setText(`${_data[0].first_name} ${_data[0].last_name} `);

    // Optional flatten
    form.flatten();

    const pdfBytes = await pdfDoc.save();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=student_${studentId}_category_${categoryId}.pdf`
    );
    return res.send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error("Failed to generate PDF", err);
    return res.status(500).json({ error: "Failed to generate PDF" });
  }
}
