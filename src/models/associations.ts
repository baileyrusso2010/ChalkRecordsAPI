import { District } from "./district.model"
import { School } from "./school.model"
import { ProgramCatalog } from "./program_catalog.model"
import { Program } from "./program.model"
import { Course } from "./course.model"
import { CourseCatalog } from "./course_catalog.model"
import { Users } from "./users.model"

District.hasMany(School, { foreignKey: "district_id", as: "schools" })
School.belongsTo(District, { foreignKey: "id", as: "district" })

ProgramCatalog.hasMany(Program, { foreignKey: "program_catalog_id", as: "programs" })
Program.belongsTo(ProgramCatalog, { foreignKey: "program_catalog_id", as: "program_catalog" })

Course.belongsTo(Program, { foreignKey: "program_id", as: "program" })
Program.hasMany(Course, { foreignKey: "program_id", as: "courses" })

CourseCatalog.hasMany(Course, { foreignKey: "catalog_id", as: "courses" })
Course.belongsTo(CourseCatalog, { foreignKey: "catalog_id", as: "course_catalog" })

Users.belongsTo(School, { foreignKey: "school_id", as: "school" })
School.hasMany(Users, { foreignKey: "school_id", as: "users" })

// User belongs to a District (optional)
Users.belongsTo(District, { foreignKey: "district_id", as: "district" })
District.hasMany(Users, { foreignKey: "district_id", as: "users" })
// A Course has one teacher (User), referenced by teacher_id in Course
Course.belongsTo(Users, { foreignKey: "teacher_id", as: "users" })
Users.hasMany(Course, { foreignKey: "teacher_id", as: "course" })
//fill out wbl
// Association between WBL_types and Student_WBL

// Export all models for convenience
export { District, School }
