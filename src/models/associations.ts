// Gradebook associations
import { Grading_Categories } from "./gradebook/grading_categories.model"
import { Assignments } from "./gradebook/assignments.model"
import { Assignment_Score } from "./gradebook/assignment_score.model"
import { Assignment_Questions } from "./gradebook/assignment_questions.model"
import { Question_Scores } from "./gradebook/question_scores.model"

import { Assessments } from "./assessments/assessments.model"
import { Scoring_Bands } from "./assessments/scoring_bands.model"
import { Student_Assessment_Results } from "./assessments/student_assessment_results.model"
import { Attendance } from "./attendance.model"

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

import { Student } from "./student.model"
import { Enrollment } from "./enrollment.model"

import { Flag } from "./flags/flag.model"
import { StudentFlag } from "./flags/student_flags.model"

import { Staff } from "./staff.model"

import { Skill } from "./skill.model"
import { SkillCategory } from "./skill_category.model"
import { SkillScore } from "./skill_score.model"

import { Form } from "./forms/form.model"
import { Rubric_Sections } from "./forms/rubric_sections.model"
import { Rubric_Rows } from "./forms/rubric_rows.model"
import { Rubric_Columns } from "./forms/rubric_columns.model"
import { Rubric_Grades } from "./forms/rubric_grades.model"
import Form_Static_Fields from "./forms/form_static_fields"
import Form_Static_Values from "./forms/form_static_values"
import { StudentForm } from "./student_form.model"
import { ClassFormAssignment } from "./forms/class_form_assignment.model"

import { WBL_Hours } from "./wbl/wbl_hours.model"
import { WBL_Catagories } from "./wbl/wbl_catagories.model"
import { WBL_Deployment_Recipients } from "./wbl/wbl_deployment_recipients.model"
import { WBL_Deployments } from "./wbl/wbl_deployments.model"

// NOTE: Several controllers reference models (Program, Users, SubCourse, etc.) that
// are not present in the current codebase snapshot. Their associations are therefore
// omitted here. Add them later when those model definitions exist.

// CourseInstance → hasMany GradingCategory
Course_Instance.hasMany(Grading_Categories, {
    foreignKey: "course_instance_id",
    as: "grading_categories",
})
Grading_Categories.belongsTo(Course_Instance, {
    foreignKey: "course_instance_id",
    as: "course_instance",
})

// CourseInstance → hasMany Assignment
Course_Instance.hasMany(Assignments, {
    foreignKey: "course_instance_id",
    as: "assignments",
})
Assignments.belongsTo(Course_Instance, {
    foreignKey: "course_instance_id",
    as: "course_instance",
})

// GradingCategory → hasMany Assignment
Grading_Categories.hasMany(Assignments, {
    foreignKey: "grading_category_id",
    as: "assignments",
})
Assignments.belongsTo(Grading_Categories, {
    foreignKey: "grading_category_id",
    as: "grading_category",
})

// Assignment → hasMany AssignmentScore
Assignments.hasMany(Assignment_Score, {
    foreignKey: "assignment_id",
    as: "assignment_scores",
})
Assignment_Score.belongsTo(Assignments, {
    foreignKey: "assignment_id",
    as: "assignment",
})

// Assignment → hasMany AssignmentQuestion
Assignments.hasMany(Assignment_Questions, {
    foreignKey: "assignment_id",
    as: "assignment_questions",
})
Assignment_Questions.belongsTo(Assignments, {
    foreignKey: "assignment_id",
    as: "assignment",
})

// AssignmentScore → belongsTo Enrollment
Assignment_Score.belongsTo(Enrollment, {
    foreignKey: "enrollment_id",
    as: "enrollments",
})
Enrollment.hasMany(Assignment_Score, {
    foreignKey: "enrollment_id",
    as: "assignment_scores",
})

// AssignmentQuestion → hasMany QuestionScore
Assignment_Questions.hasMany(Question_Scores, {
    foreignKey: "assignment_question_id",
    as: "question_scores",
})
Question_Scores.belongsTo(Assignment_Questions, {
    foreignKey: "assignment_question_id",
    as: "assignment_question",
})

// QuestionScore → belongsTo Enrollment
Question_Scores.belongsTo(Enrollment, {
    foreignKey: "enrollment_id",
    as: "enrollments",
})
Enrollment.hasMany(Question_Scores, {
    foreignKey: "enrollment_id",
    as: "question_scores",
})

// District 1:M School
CTE_District.hasMany(CTE_School, { foreignKey: "district_id", as: "schools" })
CTE_School.belongsTo(CTE_District, {
    foreignKey: "district_id",
    as: "district",
})

// School 1:M Home_School (home feeder schools)
CTE_School.hasMany(Home_School, {
    foreignKey: "cte_school_id",
    as: "home_schools",
})
Home_School.belongsTo(CTE_School, {
    foreignKey: "cte_school_id",
    as: "cte_school",
})

// District 1:M School Years
CTE_District.hasMany(School_Year, {
    foreignKey: "district_id",
    as: "school_years",
})
School_Year.belongsTo(CTE_District, {
    foreignKey: "district_id",
    as: "district",
})

// School Year 1:M Terms
School_Year.hasMany(Term, { foreignKey: "school_year_id", as: "terms" })
Term.belongsTo(School_Year, {
    foreignKey: "school_year_id",
    as: "school_year",
})

// Program Catalog 1:M District Programs (district offering of a catalog program)
Program_Catalog.hasMany(CTE_District_Program, {
    foreignKey: "program_id",
    as: "district_programs",
})
CTE_District_Program.belongsTo(Program_Catalog, {
    foreignKey: "program_id",
    as: "program_catalog",
})

// District 1:M District Programs
CTE_District.hasMany(CTE_District_Program, {
    foreignKey: "cte_district_id",
    as: "district_programs",
})
CTE_District_Program.belongsTo(CTE_District, {
    foreignKey: "cte_district_id",
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
CTE_District_Program.hasMany(Course_Instance, {
    foreignKey: "district_program_id",
    as: "course_instances",
})
Course_Instance.belongsTo(CTE_District_Program, {
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
    as: "instructed_courses",
})
Course_Instance.belongsTo(Staff, {
    foreignKey: "instructorId",
    as: "instructor",
})

// School 1:M Course Instances
CTE_School.hasMany(Course_Instance, {
    foreignKey: "cte_school_id",
    as: "course_instances",
})
Course_Instance.belongsTo(CTE_School, {
    foreignKey: "cte_school_id",
    as: "cte_school",
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

// Student belongs to Home_School and CTE_School
Student.belongsTo(Home_School, { foreignKey: "home_school_id", as: "home_school" })
Home_School.hasMany(Student, { foreignKey: "home_school_id", as: "students" })

Student.belongsTo(CTE_School, { foreignKey: "cte_school_id", as: "cte_school" })
CTE_School.hasMany(Student, { foreignKey: "cte_school_id", as: "students" })

// Student 1:M Attendance
Student.hasMany(Attendance, { foreignKey: "student_id", as: "attendance" })
Attendance.belongsTo(Student, { foreignKey: "student_id", as: "student" })

SkillCategory.hasMany(Skill, { foreignKey: "category_id", as: "skills" })
Skill.belongsTo(SkillCategory, {
    foreignKey: "category_id",
    as: "skill_category",
})

Skill.hasMany(SkillScore, { foreignKey: "skill_id" })
SkillScore.belongsTo(Skill, { foreignKey: "skill_id" })

// Form Associations
Form.hasMany(Rubric_Sections, { foreignKey: "form_id", as: "rubric_sections" })
Rubric_Sections.belongsTo(Form, { foreignKey: "form_id", as: "form" })

Form.hasMany(ClassFormAssignment, { foreignKey: "form_id", as: "class_form_assignments" })
ClassFormAssignment.belongsTo(Form, { foreignKey: "form_id", as: "form" })

Course_Instance.hasMany(ClassFormAssignment, {
    foreignKey: "class_id",
    as: "class_form_assignments",
})
ClassFormAssignment.belongsTo(Course_Instance, { foreignKey: "class_id", as: "course_instance" })

Term.hasMany(ClassFormAssignment, { foreignKey: "period_id", as: "class_form_assignments" })
ClassFormAssignment.belongsTo(Term, { foreignKey: "period_id", as: "term" })

ClassFormAssignment.hasMany(StudentForm, {
    foreignKey: "class_form_assignment_id",
    as: "student_forms",
})
StudentForm.belongsTo(ClassFormAssignment, {
    foreignKey: "class_form_assignment_id",
    as: "class_form_assignment",
})

StudentForm.belongsTo(Form, { foreignKey: "form_id", as: "form" })
Form.hasMany(StudentForm, { foreignKey: "form_id", as: "student_forms" })

Rubric_Sections.hasMany(Form_Static_Fields, {
    foreignKey: "rubric_section_id",
    as: "static_fields",
})
Form_Static_Fields.belongsTo(Rubric_Sections, {
    foreignKey: "rubric_section_id",
    as: "rubric_section",
})

Form.belongsToMany(Student, {
    through: StudentForm,
    foreignKey: "form_id",
    as: "students",
})
Student.belongsToMany(Form, {
    through: StudentForm,
    foreignKey: "student_id",
    as: "forms",
})

// Rubric Sections Associations
Rubric_Sections.hasMany(Rubric_Rows, {
    foreignKey: "rubric_section_id",
    as: "rubric_rows",
})
Rubric_Rows.belongsTo(Rubric_Sections, {
    foreignKey: "rubric_section_id",
    as: "rubric_section",
})

Rubric_Sections.hasMany(Rubric_Columns, {
    foreignKey: "rubric_section_id",
    as: "rubric_columns",
})
Rubric_Columns.belongsTo(Rubric_Sections, {
    foreignKey: "rubric_section_id",
    as: "rubric_section",
})

// Rubric Rows Associations
Rubric_Rows.hasMany(Rubric_Grades, {
    foreignKey: "rubric_row_id",
    as: "rubric_grades",
})
Rubric_Grades.belongsTo(Rubric_Rows, {
    foreignKey: "rubric_row_id",
    as: "rubric_row",
})

// Rubric Columns Associations
Rubric_Columns.hasMany(Rubric_Grades, {
    foreignKey: "rubric_column_id",
    as: "rubric_grades",
})
Rubric_Grades.belongsTo(Rubric_Columns, {
    foreignKey: "rubric_column_id",
    as: "rubric_column",
})

// Rubric Grades Associations
Rubric_Grades.belongsTo(Student, { foreignKey: "student_id", as: "student" })
Student.hasMany(Rubric_Grades, {
    foreignKey: "student_id",
    as: "rubric_grades",
})

// Form Static Fields Associations
Form_Static_Fields.hasMany(Form_Static_Values, {
    //form responses

    foreignKey: "form_static_field",
    as: "static_values",
})
Form_Static_Values.belongsTo(Form_Static_Fields, {
    foreignKey: "form_static_field",
    as: "static_field",
})

// Form Static Values Associations
Form_Static_Values.belongsTo(Student, {
    foreignKey: "student_id",
    as: "student",
})
Student.hasMany(Form_Static_Values, {
    foreignKey: "student_id",
    as: "static_values",
})

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
