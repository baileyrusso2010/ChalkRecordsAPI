import { Request, Response } from "express";
import { Class } from "../models/classes.model";
import { ClassStudents } from "../models/class_students.model";
import { Student } from "../models/student.model";
import { StudentFlags } from "../models/student_flags.model";
import { Flag } from "../models/flag.model";
import { Op } from "sequelize";

// Get class info with total student count
export const getClassWithStudentCount = async (req: Request, res: Response) => {
  const classId = req.params.id;
  try {
    const classObj = await Class.findByPk(classId, {
      include: [
        {
          model: ClassStudents,
          attributes: [],
        },
      ],
    });
    if (!classObj) return res.status(404).json({ error: "Class not found" });
    // Count students in class
    const studentCount = await ClassStudents.count({
      where: { class_id: classId },
    });
    res.json({ class: classObj, studentCount });
  } catch (err) {
    res.status(500).json({ error: "Failed to get class info" });
  }
};

// Get number of students in a class with a specific flag
export const getClassFlagCount = async (req: Request, res: Response) => {
  const classId = req.params.id;
  const flagId = req.params.flagId;
  try {
    // Find all student_ids in the class
    const classStudents = await ClassStudents.findAll({
      where: { class_id: classId },
      attributes: ["student_id"],
    });
    const studentIds = classStudents.map((cs) => cs.student_id);
    // Count students with the flag
    const count = await StudentFlags.count({
      where: {
        student_id: { [Op.in]: studentIds },
        flag_id: flagId,
      },
    });
    res.json({ classId, flagId, count });
  } catch (err) {
    res.status(500).json({ error: "Failed to get flag count" });
  }
};
