import { readFileSync, writeFileSync } from "fs";
import { PDFDocument, TextAlignment } from "pdf-lib";
import { Skill } from "../../models/skill.model";
import { SkillScore } from "../../models/skill_score.model";

export async function fillForm() {
  const existingPdfBytes = readFileSync("./Animal_Full.pdf");

  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const form = pdfDoc.getForm();

  const student_id = 1;
  const category_id = 1;

  let results = await Skill.findAll({
    include: {
      model: SkillScore,
      where: {
        student_id,
      },
      required: false,
    },
    where: {
      category_id,
      active: true,
    },
  });

  const data = results.map((r) => r.toJSON());

  for (let i = 0; i < 17; i++) {
    const nameField = form.getTextField(`Ind_Tech_Expectation_.${i + 1}`);
    const desc = form.getTextField(`Ind_Tech_Skill_.${i + 1}`);
    nameField.setText(data[i]?.title);
    desc.setText("");
  }

  for (let i = 0; i < data.length; i++) {
    const titleField = form.getTextField(`Ind_Tech_Skill_.${i + 1}`);
    titleField.setText(data[i].title);
    titleField.setAlignment(TextAlignment.Center);

    const nameField = form.getTextField(`Ind_Tech_Expectation_.${i + 1}`);
    nameField.setText(data[i].description);
    const comment = form.getTextField(`COMMENTS_Tech_0${i + 1}`);
    for (let j = 0; j < data[i].SkillScores.length; j++) {
      const qtrField = form.getTextField(`Tech_0${i + 1}_Jr_Sem_${j + 1}`);
      qtrField.setText(data[i].SkillScores[j].score || "");
      comment.setText(data[i].SkillScores[j].comment || "");
    }
  }

  const studentName = form.getTextField("StudentName");
  studentName.setText("Bailey Russo");
  console.log("Student Name: bailey Russo");

  form.flatten(); //optional? for non-editable

  // Save
  const pdfBytes = await pdfDoc.save();
  writeFileSync(`./filled_${Date.now()}.pdf`, pdfBytes);
}
