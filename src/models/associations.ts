// Central place to define Sequelize associations between models
// This file is imported once in index.ts to ensure associations are registered

import { Course_Catalog } from "./course/course_catalog.model"
import { Course_Instance } from "./course/course_instance.model"

import { CTE_District } from "./school/cte_district.model"
import { CTE_School } from "./school/cte_school.model"
import { Home_School } from "./school/home_school.model"

import { CTE_District_Program } from "./program/cte_district_program.model"
import { Program_Catalog } from "./program/program_catalog.model"

import { School_Year } from "./term/school_year.model"
import { Term } from "./term/term.model"

// NOTE: Several controllers reference models (Program, Users, SubCourse, etc.) that
// are not present in the current codebase snapshot. Their associations are therefore
// omitted here. Add them later when those model definitions exist.

// District 1:M School
CTE_District.hasMany(CTE_School, { foreignKey: "district_id", as: "schools" })
CTE_School.belongsTo(CTE_District, { foreignKey: "district_id", as: "district" })

// School 1:M Home_School (home feeder schools)
CTE_School.hasMany(Home_School, { foreignKey: "cte_school_id", as: "home_schools" })
Home_School.belongsTo(CTE_School, { foreignKey: "cte_school_id", as: "cte_school" })

// District 1:M School Years
CTE_District.hasMany(School_Year, { foreignKey: "district_id", as: "school_years" })
School_Year.belongsTo(CTE_District, { foreignKey: "district_id", as: "district" })

// School Year 1:M Terms
School_Year.hasMany(Term, { foreignKey: "school_year_id", as: "terms" })
Term.belongsTo(School_Year, { foreignKey: "school_year_id", as: "school_year" })

// Program Catalog 1:M District Programs (district offering of a catalog program)
Program_Catalog.hasMany(CTE_District_Program, { foreignKey: "program_id", as: "district_programs" })
CTE_District_Program.belongsTo(Program_Catalog, { foreignKey: "program_id", as: "program_catalog" })

// District 1:M District Programs
CTE_District.hasMany(CTE_District_Program, {
    foreignKey: "cte_district_id",
    as: "district_programs",
})
CTE_District_Program.belongsTo(CTE_District, { foreignKey: "cte_district_id", as: "district" })

// Course Catalog 1:M Course Instances (planned vs. instance?)
Course_Catalog.hasMany(Course_Instance, { foreignKey: "course_catalog_id", as: "course_instances" })
Course_Instance.belongsTo(Course_Catalog, { foreignKey: "course_catalog_id", as: "course_catalog" })

// Program Catalog 1:M Course Instances
Program_Catalog.hasMany(Course_Instance, {
    foreignKey: "program_catalog_id",
    as: "course_instances",
})
Course_Instance.belongsTo(Program_Catalog, {
    foreignKey: "program_catalog_id",
    as: "program_catalog",
})

// School 1:M Course Instances
CTE_School.hasMany(Course_Instance, { foreignKey: "cte_school_id", as: "course_instances" })
Course_Instance.belongsTo(CTE_School, { foreignKey: "cte_school_id", as: "cte_school" })

// School Year 1:M Course Instances
School_Year.hasMany(Course_Instance, { foreignKey: "school_year_id", as: "course_instances" })
Course_Instance.belongsTo(School_Year, { foreignKey: "school_year_id", as: "school_year" })

// Term 1:M Course Instances
Term.hasMany(Course_Instance, { foreignKey: "term_id", as: "course_instances" })
Course_Instance.belongsTo(Term, { foreignKey: "term_id", as: "term" })

// Export a function in case manual initialization is needed elsewhere
export function initAssociations() {
    return true
}
