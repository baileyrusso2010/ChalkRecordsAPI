// This file sets up all Sequelize model associations in one place.
import { ClassStudents } from "./class_students.model"
import { Class as Classes } from "./classes.model"
import { Student } from "./student.model"
import { Staff } from "./staff.model"
import { SchoolDistricts } from "./school_district.model"
import { Program } from "./program.model"
import { Flag } from "./flag.model"
import { StudentFlags } from "./student_flags.model"
import { CTESchool } from "./cte_school.model"
import { Attendance } from "./attendance.model"
import { WBL_types } from "./wbl_types.model"
import { Student_WBL } from "./student_wbl_hours.model"
import { Grades } from "./grades.model"
import { TechnicalAssessment } from "./technical_assessment.model"

//fill out wbl
// Association between WBL_types and Student_WBL
WBL_types.hasMany(Student_WBL, { foreignKey: "wbl_type_id", as: "student_wbl_hours" })
Student_WBL.belongsTo(WBL_types, { foreignKey: "wbl_type_id", as: "wbl_type" })

Student.hasMany(Attendance, { foreignKey: "student_id", as: "attendance" })
Attendance.belongsTo(Student, { foreignKey: "student_id", as: "student" })

Student.hasOne(Grades, { foreignKey: "student_id", as: "grades" })
Grades.belongsTo(Student, { foreignKey: "student_id", as: "student" })

Student.hasOne(TechnicalAssessment, { foreignKey: "student_id", as: "technical_assessment" })
TechnicalAssessment.belongsTo(Student, { foreignKey: "student_id", as: "student" })

// ClassStudents: Many-to-Many between Classes and Students
Classes.belongsToMany(Student, {
    through: ClassStudents,
    foreignKey: "class_id",
    otherKey: "student_id",
})
Student.belongsToMany(Classes, {
    through: ClassStudents,
    foreignKey: "student_id",
    otherKey: "class_id",
})
Student.hasMany(ClassStudents, { foreignKey: "student_id" })
ClassStudents.belongsTo(Student, { foreignKey: "student_id" })
Classes.hasMany(ClassStudents, { foreignKey: "class_id" })
ClassStudents.belongsTo(Classes, { foreignKey: "class_id" })

// (Removed duplicate belongsToMany associations between Student and Classes)

// StudentFlags: Many-to-Many between Students and Flags
Student.belongsToMany(Flag, {
    through: StudentFlags,
    foreignKey: "student_id",
    otherKey: "flag_id",
})
Flag.belongsToMany(Student, {
    through: StudentFlags,
    foreignKey: "flag_id",
    otherKey: "student_id",
})

// Classes belongs to Program
Classes.belongsTo(Program, { foreignKey: "programId" })
Program.hasMany(Classes, { foreignKey: "programId" })

// Classes belongs to Staff (teacher)
Classes.belongsTo(Staff, { foreignKey: "teacherId" })
Staff.hasMany(Classes, { foreignKey: "teacherId" })

// Students belongs to SchoolDistrict
Student.belongsTo(SchoolDistricts, { foreignKey: "schoolDistrictId" })
SchoolDistricts.hasMany(Student, { foreignKey: "schoolDistrictId" })

// Students belongs to CTESchool
Student.belongsTo(CTESchool, { foreignKey: "cteSchoolId" })
CTESchool.hasMany(Student, { foreignKey: "cteSchoolId" })

// Classes belongs to CTESchool
Classes.belongsTo(CTESchool, { foreignKey: "cte_schoolId" })
CTESchool.hasMany(Classes, { foreignKey: "cte_schoolId" })

// Export all models for convenience
export {
    ClassStudents,
    Classes,
    Student,
    Staff,
    SchoolDistricts,
    Program,
    Flag,
    StudentFlags,
    CTESchool,
}
