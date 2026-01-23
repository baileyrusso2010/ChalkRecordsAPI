// Behavior and BehaviorType associations
import { Behavior } from "./behavior/behavior.model"
import { BehaviorType } from "./behavior/behavior_type.model"

import { Assessments } from "./assessments/assessments.model"
import { Scoring_Bands } from "./assessments/scoring_bands.model"
import { Student_Assessment_Results } from "./assessments/student_assessment_results.model"
import { Attendance_Daily } from "./attendance/attendance_daily.model"
import { Attendance_Status } from "./attendance/attendance_status.model"

import { MTSS_Domains } from "./mtss/mtss_domains.model"
import { MTSS_Tiers } from "./mtss/mtss_tiers.model"
import { MTSS_Student_Tiers } from "./mtss/mtss_student_tiers.model"
import { Screenings } from "./mtss/screenings.model"
import { Interventions } from "./mtss/interventions.model"
import { Student_Interventions } from "./mtss/student_interventions.model"
import { Progress_Monitoring } from "./mtss/progress_monitoring.model"
import { MTSS_Meetings } from "./mtss/mtss_meetings.model"
import { MTSS_Decisions } from "./mtss/mtss_decisions.model"
import { Referrals } from "./mtss/referrals.model"

import { Evaluation_Document } from "./forms/evaluation_document.model"
import { Evaluation_Section } from "./forms/evaluation_sections.model"
import { Evaluation_Section_Rows } from "./forms/evaluation_section_rows.model"
import { Evaluation_Section_Columns } from "./forms/evaluation_section_columns.model"
import { Evaluation_Cells } from "./forms/evaluation_cells.model"

// Central place to define Sequelize associations between models
// This file is imported once in index.ts to ensure associations are registered

import { Course_Catalog } from "./course/course_catalog.model"
import { Course_Instance } from "./course/course_instance.model"

import { District } from "./school/district.model"
import { School } from "./school/school.model"

import { District_Program } from "./program/district_program.model"
import { Program_Catalog } from "./program/program_catalog.model"

import { School_Year } from "./term/school_year.model"
import { Term } from "./term/term.model"
import { Task } from "./term/task.model"

import { Course_Instructors } from "./course/course_instructors.model"

import { Student_Term_Grades } from "./gradebook/student_term_grades.model"

import { Student } from "./student.model"
import { Enrollment } from "./enrollment.model"

import { Flag } from "./flags/flag.model"
import { StudentFlag } from "./flags/student_flags.model"

import { Staff } from "./users/staff.model"

import { Skill } from "./skill.model"
import { SkillCategory } from "./skill_category.model"
import { SkillScore } from "./skill_score.model"

import { WBL_Hours } from "./wbl/wbl_hours.model"
import { WBL_Catagories } from "./wbl/wbl_catagories.model"
import { WBL_Deployment_Recipients } from "./wbl/wbl_deployment_recipients.model"
import { WBL_Deployments } from "./wbl/wbl_deployments.model"

import { Rubric } from "./rubric/rubric.model"
import { Rubric_Criteria } from "./rubric/rubric_criteria.model"

import { Roles } from "./users/roles.model"
import { Staff_Roles } from "./users/staff_roles.model"
import { Permissions } from "./users/permissions.model"
import { RolePermissions } from "./users/role_permissions.model"

import { Form_Template } from "./forms/template/form_template.model"
import { Template_Section } from "./forms/template/template_section.model"
import { Template_Row } from "./forms/template/template_row.model"
import { Template_Column } from "./forms/template/template_column.model"

Form_Template.hasMany(Template_Section, {
    foreignKey: "template_id",
    as: "sections",
})
Template_Section.belongsTo(Form_Template, {
    foreignKey: "template_id",
    as: "template",
})

Template_Section.hasMany(Template_Row, {
    foreignKey: "section_id",
    as: "rows",
})
Template_Row.belongsTo(Template_Section, {
    foreignKey: "section_id",
    as: "section",
})

Template_Row.hasMany(Template_Column, {
    foreignKey: "row_id",
    as: "columns",
})
Template_Column.belongsTo(Template_Row, {
    foreignKey: "row_id",
    as: "row",
})

Template_Column.belongsTo(Template_Section, {
    foreignKey: "section_id",
    as: "section",
})

Template_Section.hasMany(Template_Column, {
    foreignKey: "section_id",
    as: "columns",
})

Evaluation_Document.hasMany(Evaluation_Section, {
    foreignKey: "document_id",
    as: "sections",
})

Evaluation_Document.belongsTo(Course_Instance, {
    foreignKey: "class_id",
    as: "course_instance",
})
Course_Instance.hasMany(Evaluation_Document, {
    foreignKey: "class_id",
    as: "evaluation_documents",
})
Evaluation_Section.belongsTo(Evaluation_Document, {
    foreignKey: "document_id",
    as: "document",
})

Evaluation_Section.hasMany(Evaluation_Section_Rows, {
    foreignKey: "section_id",
    as: "rows",
})
Evaluation_Section_Rows.belongsTo(Evaluation_Section, {
    foreignKey: "section_id",
    as: "section",
})

Evaluation_Section.hasMany(Evaluation_Section_Columns, {
    foreignKey: "section_id",
    as: "columns",
})
Evaluation_Section_Columns.belongsTo(Evaluation_Section, {
    foreignKey: "section_id",
    as: "section",
})

Evaluation_Section_Columns.hasMany(Evaluation_Cells, {
    foreignKey: "column_id",
    as: "cells",
})
Evaluation_Cells.belongsTo(Evaluation_Section_Columns, {
    foreignKey: "column_id",
    as: "column",
})

Evaluation_Cells.hasMany(Evaluation_Cells, {
    foreignKey: "cell_id",
    as: "cells",
})
Evaluation_Cells.belongsTo(Evaluation_Cells, {
    foreignKey: "cell_id",
    as: "cell",
})

Roles.belongsToMany(Staff, {
    through: Staff_Roles,
    foreignKey: "role_id",
    as: "staff",
})
Staff.belongsToMany(Roles, {
    through: Staff_Roles,
    foreignKey: "staff_id",
    as: "roles",
})

Roles.belongsToMany(Permissions, {
    through: RolePermissions,
    foreignKey: "role_id",
    as: "permissions",
})
Permissions.belongsToMany(Roles, {
    through: RolePermissions,
    foreignKey: "permission_id",
    as: "roles",
})

Behavior.belongsTo(BehaviorType, {
    foreignKey: "behavior_type_id",
    as: "behavior_type",
})
BehaviorType.hasMany(Behavior, {
    foreignKey: "behavior_type_id",
    as: "behaviors",
})

// Behavior belongsTo Student association (for eager loading in metrics)
Behavior.belongsTo(Student, {
    foreignKey: "student_id",
    as: "student",
})
Student.hasMany(Behavior, {
    foreignKey: "student_id",
    as: "behaviors",
})

// Behavior belongsTo Staff
Behavior.belongsTo(Staff, {
    foreignKey: "staff_id",
    as: "staff",
})
Staff.hasMany(Behavior, {
    foreignKey: "staff_id",
    as: "behaviors",
})

// District and School Associations
District.hasMany(School, { foreignKey: "district_id", as: "schools" })
School.belongsTo(District, {
    foreignKey: "district_id",
    as: "district",
})

// District 1:M School Years
District.hasMany(School_Year, {
    foreignKey: "district_id",
    as: "school_years",
})
School_Year.belongsTo(District, {
    foreignKey: "district_id",
    as: "district",
})

// Program Catalog 1:M District Programs
Program_Catalog.hasMany(District_Program, {
    foreignKey: "program_id",
    as: "district_programs",
})
District_Program.belongsTo(Program_Catalog, {
    foreignKey: "program_id",
    as: "program_catalog",
})

// District 1:M District Programs
District.hasMany(District_Program, {
    foreignKey: "district_id",
    as: "district_programs",
})
District_Program.belongsTo(District, {
    foreignKey: "district_id",
    as: "district",
})

// Course Catalog 1:M Course Instances (planned vs. instance?)
Course_Catalog.hasMany(Course_Instance, {
    foreignKey: "course_catalog_id",
    as: "course_instances",
})
Course_Instance.belongsTo(Course_Catalog, {
    foreignKey: "course_catalog_id",
    as: "course_catalog",
})
District_Program.hasMany(Course_Instance, {
    foreignKey: "district_program_id",
    as: "course_instances",
})
Course_Instance.belongsTo(District_Program, {
    foreignKey: "district_program_id",
    as: "district_program",
})

// Program Catalog 1:M Course Instances
Program_Catalog.hasMany(Course_Instance, {
    foreignKey: "district_program_id",
    as: "course_instances",
})
Course_Instance.belongsTo(Program_Catalog, {
    foreignKey: "district_program_id",
    as: "program_catalog",
})

Staff.hasMany(Course_Instance, {
    foreignKey: "instructorId",
    as: "course_instances",
})
Course_Instance.belongsTo(Staff, {
    foreignKey: "instructorId",
    as: "instructor",
})

// School 1:M Course Instances
School.hasMany(Course_Instance, {
    foreignKey: "school_id",
    as: "course_instances",
})
Course_Instance.belongsTo(School, {
    foreignKey: "school_id",
    as: "school",
})

// School Year 1:M Course Instances
School_Year.hasMany(Course_Instance, {
    foreignKey: "school_year_id",
    as: "course_instances",
})
Course_Instance.belongsTo(School_Year, {
    foreignKey: "school_year_id",
    as: "school_year",
})

// Term 1:M Course Instances
Term.hasMany(Course_Instance, {
    foreignKey: "term_id",
    as: "course_instances",
})
Course_Instance.belongsTo(Term, { foreignKey: "term_id", as: "term" })

// Optional: Enrollment model to link Students to Course Instances
Student.hasMany(Enrollment, { foreignKey: "student_id", as: "enrollments" })
Enrollment.belongsTo(Student, { foreignKey: "student_id", as: "student" })

Course_Instance.hasMany(Enrollment, {
    foreignKey: "course_instance_id",
    as: "enrollments",
})
Enrollment.belongsTo(Course_Instance, {
    foreignKey: "course_instance_id",
    as: "course_instance",
})

// Student M:N Flag through StudentFlag
Student.belongsToMany(Flag, {
    through: StudentFlag,
    foreignKey: "student_id",
    otherKey: "flag_id",
    as: "flags",
})
Flag.belongsToMany(Student, {
    through: StudentFlag,
    foreignKey: "flag_id",
    otherKey: "student_id",
    as: "students",
})

// Student 1:M StudentFlag
Student.hasMany(StudentFlag, { foreignKey: "student_id" })
StudentFlag.belongsTo(Student, { foreignKey: "student_id" })

// Flag 1:M StudentFlag
Flag.hasMany(StudentFlag, { foreignKey: "flag_id" })
StudentFlag.belongsTo(Flag, { foreignKey: "flag_id" })

// Student belongs to School
Student.belongsTo(School, { foreignKey: "school_id", as: "school" })
School.hasMany(Student, { foreignKey: "school_id", as: "students" })

// Student 1:M Attendance
Student.hasMany(Attendance_Daily, {
    foreignKey: "student_id",
    as: "attendance",
})
Attendance_Daily.belongsTo(Student, {
    foreignKey: "student_id",
    as: "student",
})

SkillCategory.hasMany(Skill, { foreignKey: "category_id", as: "skills" })
Skill.belongsTo(SkillCategory, {
    foreignKey: "category_id",
    as: "skill_category",
})

Skill.hasMany(SkillScore, { foreignKey: "skill_id" })
SkillScore.belongsTo(Skill, { foreignKey: "skill_id" })

// Form Associations
// WBL Associations
WBL_Catagories.hasMany(WBL_Hours, {
    foreignKey: "catagory_id",
    as: "wbl_hours",
})
WBL_Hours.belongsTo(WBL_Catagories, {
    foreignKey: "catagory_id",
    as: "category",
})

WBL_Hours.belongsTo(Student, {
    foreignKey: "student_id",
    as: "student",
})
Student.hasMany(WBL_Hours, {
    foreignKey: "student_id",
    as: "wbl_hours",
})

// ...existing WBL associations...

// WBL Deployments Associations
// WBL_Deployments.belongsTo(Staff, {
//     foreignKey: "staff_id",
//     as: "staff",
// })
// Staff.hasMany(WBL_Deployments, {
//     foreignKey: "staff_id",
//     as: "wbl_deployments",
// })

// WBL Deployment Recipients Associations
WBL_Deployment_Recipients.belongsTo(WBL_Deployments, {
    foreignKey: "deployment_id",
    as: "deployment",
})
WBL_Deployments.hasMany(WBL_Deployment_Recipients, {
    foreignKey: "deployment_id",
    as: "recipients",
})

WBL_Deployment_Recipients.belongsTo(Student, {
    foreignKey: "student_id",
    as: "student",
})
Student.hasMany(WBL_Deployment_Recipients, {
    foreignKey: "student_id",
    as: "wbl_deployment_recipients",
})

// Assessments 1:M Scoring_Bands
Assessments.hasMany(Scoring_Bands, {
    foreignKey: "assessment_id",
    as: "scoring_bands",
})
Scoring_Bands.belongsTo(Assessments, {
    foreignKey: "assessment_id",
    as: "assessment",
})

// Assessments 1:M Student_Assessment_Results
Assessments.hasMany(Student_Assessment_Results, {
    foreignKey: "assessment_id",
    as: "student_results",
})
Student_Assessment_Results.belongsTo(Assessments, {
    foreignKey: "assessment_id",
    as: "assessment",
})

// Student 1:M Student_Assessment_Results
Student.hasMany(Student_Assessment_Results, {
    foreignKey: "student_id",
    as: "assessment_results",
})
Student_Assessment_Results.belongsTo(Student, {
    foreignKey: "student_id",
    as: "student",
})

// Scoring_Bands 1:M Student_Assessment_Results (optional, if band_id is used)
Scoring_Bands.hasMany(Student_Assessment_Results, {
    foreignKey: "band_id",
    as: "student_results",
})
Student_Assessment_Results.belongsTo(Scoring_Bands, {
    foreignKey: "band_id",
    as: "scoring_band",
})
// WBL Deployments Associations
WBL_Deployments.belongsTo(Staff, {
    foreignKey: "staff_id",
    as: "staff",
})
Staff.hasMany(WBL_Deployments, {
    foreignKey: "staff_id",
    as: "wbl_deployments",
})

// Student 1:M Student_Term_Grades
Student.hasMany(Student_Term_Grades, {
    foreignKey: "student_id",
    as: "student_term_grades",
})
Student_Term_Grades.belongsTo(Student, {
    foreignKey: "student_id",
    as: "students",
})

Course_Instance.hasMany(Student_Term_Grades, {
    foreignKey: "course_instance_id",
    as: "student_term_grades",
})
Student_Term_Grades.belongsTo(Course_Instance, {
    foreignKey: "course_instance_id",
    as: "course_instance",
})

Task.hasMany(Student_Term_Grades, {
    foreignKey: "task_id",
    as: "student_term_grades",
})
Student_Term_Grades.belongsTo(Task, {
    foreignKey: "task_id",
    as: "task",
})

Enrollment.hasMany(Student_Term_Grades, {
    foreignKey: "enrollment_id",
    as: "student_term_grades",
})
Student_Term_Grades.belongsTo(Enrollment, {
    foreignKey: "enrollment_id",
    as: "enrollments",
})

Course_Instance.hasMany(Course_Instructors, {
    foreignKey: "course_instance_id",
    as: "course_instructors",
})
Course_Instructors.belongsTo(Course_Instance, {
    foreignKey: "course_instance_id",
    as: "course_instance",
})

Staff.hasMany(Course_Instructors, {
    foreignKey: "staff_id",
    as: "course_instructors",
})
Course_Instructors.belongsTo(Staff, {
    foreignKey: "staff_id",
    as: "staff",
})

Attendance_Daily.belongsTo(School, {
    foreignKey: "school_id",
    as: "school",
})
School.hasMany(Attendance_Daily, {
    foreignKey: "school_id",
    as: "attendance",
})

Attendance_Daily.belongsTo(Attendance_Status, {
    foreignKey: "attendance_status_id",
    as: "attendance_status",
})
Attendance_Status.hasMany(Attendance_Daily, {
    foreignKey: "attendance_status_id",
    as: "attendance",
})

// Rubric associations
Rubric.hasMany(Rubric_Criteria, {
    foreignKey: "rubric_id",
    as: "criteria",
})
Rubric_Criteria.belongsTo(Rubric, {
    foreignKey: "rubric_id",
    as: "rubric",
})

// MTSS Associations

// Student Tiers
MTSS_Student_Tiers.belongsTo(Student, { foreignKey: "student_id" })
Student.hasMany(MTSS_Student_Tiers, { foreignKey: "student_id" })

MTSS_Student_Tiers.belongsTo(MTSS_Domains, { foreignKey: "domain_id" })
MTSS_Student_Tiers.belongsTo(MTSS_Tiers, { foreignKey: "tier_id" })

// Screenings
Screenings.belongsTo(Student, { foreignKey: "student_id" })
Student.hasMany(Screenings, { foreignKey: "student_id" })
Screenings.belongsTo(MTSS_Domains, { foreignKey: "domain_id" })

// Interventions
Interventions.belongsTo(MTSS_Domains, { foreignKey: "domain_id" })
Interventions.belongsTo(MTSS_Tiers, { foreignKey: "tier_id" })

// Student Interventions
Student_Interventions.belongsTo(Student, { foreignKey: "student_id" })
Student.hasMany(Student_Interventions, { foreignKey: "student_id" })

Student_Interventions.belongsTo(Interventions, { foreignKey: "intervention_id" })
Interventions.hasMany(Student_Interventions, { foreignKey: "intervention_id" })

// Progress Monitoring
Progress_Monitoring.belongsTo(Student_Interventions, { foreignKey: "student_intervention_id" })
Student_Interventions.hasMany(Progress_Monitoring, { foreignKey: "student_intervention_id" })

// Meetings
MTSS_Meetings.belongsTo(Student, { foreignKey: "student_id" })
Student.hasMany(MTSS_Meetings, { foreignKey: "student_id" })

// Decisions
MTSS_Decisions.belongsTo(MTSS_Meetings, { foreignKey: "meeting_id" })
MTSS_Meetings.hasMany(MTSS_Decisions, { foreignKey: "meeting_id" })

// Referrals
Referrals.belongsTo(Student, { foreignKey: "student_id" })
Student.hasMany(Referrals, { foreignKey: "student_id" })
