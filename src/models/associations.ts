// This file sets up all Sequelize model associations in one place.
import { ClassStudents } from "./class_students.model";
import { Class as Classes } from "./classes.model";
import { Student as Students } from "./student.model";
import { Staff } from "./staff.model";
import { SchoolDistricts } from "./school_district.model";
import { Program } from "./program.model";
import { Flag } from "./flag.model";
import { StudentFlags } from "./student_flags.model";
import { CTESchool } from "./cte_school.model";

// ClassStudents: Many-to-Many between Classes and Students
Classes.belongsToMany(Students, {
  through: ClassStudents,
  foreignKey: "class_id",
  otherKey: "student_id",
});
Students.belongsToMany(Classes, {
  through: ClassStudents,
  foreignKey: "student_id",
  otherKey: "class_id",
});
Students.hasMany(ClassStudents, { foreignKey: "student_id" });
ClassStudents.belongsTo(Students, { foreignKey: "student_id" });
Classes.hasMany(ClassStudents, { foreignKey: "class_id" });
ClassStudents.belongsTo(Classes, { foreignKey: "class_id" });

// StudentFlags: Many-to-Many between Students and Flags
Students.belongsToMany(Flag, {
  through: StudentFlags,
  foreignKey: "student_id",
  otherKey: "flag_id",
});
Flag.belongsToMany(Students, {
  through: StudentFlags,
  foreignKey: "flag_id",
  otherKey: "student_id",
});

// Classes belongs to Program
Classes.belongsTo(Program, { foreignKey: "programId" });
Program.hasMany(Classes, { foreignKey: "programId" });

// Classes belongs to Staff (teacher)
Classes.belongsTo(Staff, { foreignKey: "teacherId" });
Staff.hasMany(Classes, { foreignKey: "teacherId" });

// Students belongs to SchoolDistrict
Students.belongsTo(SchoolDistricts, { foreignKey: "schoolDistrictId" });
SchoolDistricts.hasMany(Students, { foreignKey: "schoolDistrictId" });

// Students belongs to CTESchool
Students.belongsTo(CTESchool, { foreignKey: "cteSchoolId" });
CTESchool.hasMany(Students, { foreignKey: "cteSchoolId" });

// Export all models for convenience
export {
  ClassStudents,
  Classes,
  Students,
  Staff,
  SchoolDistricts,
  Program,
  Flag,
  StudentFlags,
  CTESchool,
};
