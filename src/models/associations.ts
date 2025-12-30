// Behavior and BehaviorType associations
import { Behavior } from "./behavior/behavior.model";
import { BehaviorType } from "./behavior/behavior_type.model";

import { Assessments } from "./assessments/assessments.model";
import { Scoring_Bands } from "./assessments/scoring_bands.model";
import { Student_Assessment_Results } from "./assessments/student_assessment_results.model";
import { Attendance_Daily } from "./attendance/attendance_daily.model";
import { Attendance_Status } from "./attendance/attendance_status.model";

// Central place to define Sequelize associations between models
// This file is imported once in index.ts to ensure associations are registered

import { Course_Catalog } from "./course/course_catalog.model";
import { Course_Instance } from "./course/course_instance.model";

import { District } from "./school/district.model";
import { School } from "./school/school.model";

import { District_Program } from "./program/district_program.model";
import { Program_Catalog } from "./program/program_catalog.model";

import { School_Year } from "./term/school_year.model";
import { Term } from "./term/term.model";
import { Task } from "./term/task.model";

import { Course_Instructors } from "./course/course_instructors.model";

import { Student_Scores } from "./gradebook/student_scores.model";

import { Student } from "./student.model";
import { Enrollment } from "./enrollment.model";

import { Flag } from "./flags/flag.model";
import { StudentFlag } from "./flags/student_flags.model";

import { Staff } from "./staff.model";

import { Skill } from "./skill.model";
import { SkillCategory } from "./skill_category.model";
import { SkillScore } from "./skill_score.model";

import { Form } from "./forms/form.model";
import { Rubric_Sections } from "./forms/rubric_sections.model";
import { Rubric_Rows } from "./forms/rubric_rows.model";
import { Rubric_Columns } from "./forms/rubric_columns.model";
import { Rubric_Grades } from "./forms/rubric_grades.model";
import Form_Static_Fields from "./forms/form_static_fields";
import Form_Static_Values from "./forms/form_static_values";
import { StudentForm } from "./student_form.model";
import { ClassFormAssignment } from "./forms/class_form_assignment.model";

import { WBL_Hours } from "./wbl/wbl_hours.model";
import { WBL_Catagories } from "./wbl/wbl_catagories.model";
import { WBL_Deployment_Recipients } from "./wbl/wbl_deployment_recipients.model";
import { WBL_Deployments } from "./wbl/wbl_deployments.model";

Behavior.belongsTo(BehaviorType, {
  foreignKey: "behavior_type_id",
  as: "behavior_type",
});
BehaviorType.hasMany(Behavior, {
  foreignKey: "behavior_type_id",
  as: "behaviors",
});

// Behavior belongsTo Student association (for eager loading in metrics)
Behavior.belongsTo(Student, {
  foreignKey: "student_id",
  as: "student",
});
Student.hasMany(Behavior, {
  foreignKey: "student_id",
  as: "behaviors",
});

// Behavior belongsTo Staff
Behavior.belongsTo(Staff, {
  foreignKey: "staff_id",
  as: "staff",
});
Staff.hasMany(Behavior, {
  foreignKey: "staff_id",
  as: "behaviors",
});

// District and School Associations
District.hasMany(School, { foreignKey: "district_id", as: "schools" });
School.belongsTo(District, {
  foreignKey: "district_id",
  as: "district",
});

// District 1:M School Years
District.hasMany(School_Year, {
  foreignKey: "district_id",
  as: "school_years",
});
School_Year.belongsTo(District, {
  foreignKey: "district_id",
  as: "district",
});

// Program Catalog 1:M District Programs
Program_Catalog.hasMany(District_Program, {
  foreignKey: "program_id",
  as: "district_programs",
});
District_Program.belongsTo(Program_Catalog, {
  foreignKey: "program_id",
  as: "program_catalog",
});

// District 1:M District Programs
District.hasMany(District_Program, {
  foreignKey: "district_id",
  as: "district_programs",
});
District_Program.belongsTo(District, {
  foreignKey: "district_id",
  as: "district",
});

// Course Catalog 1:M Course Instances (planned vs. instance?)
Course_Catalog.hasMany(Course_Instance, {
  foreignKey: "course_catalog_id",
  as: "course_instances",
});
Course_Instance.belongsTo(Course_Catalog, {
  foreignKey: "course_catalog_id",
  as: "course_catalog",
});
District_Program.hasMany(Course_Instance, {
  foreignKey: "district_program_id",
  as: "course_instances",
});
Course_Instance.belongsTo(District_Program, {
  foreignKey: "district_program_id",
  as: "district_program",
});

// Program Catalog 1:M Course Instances
Program_Catalog.hasMany(Course_Instance, {
  foreignKey: "district_program_id",
  as: "course_instances",
});
Course_Instance.belongsTo(Program_Catalog, {
  foreignKey: "district_program_id",
  as: "program_catalog",
});

Staff.hasMany(Course_Instance, {
  foreignKey: "instructorId",
  as: "instructed_courses",
});
Course_Instance.belongsTo(Staff, {
  foreignKey: "instructorId",
  as: "instructor",
});

// School 1:M Course Instances
School.hasMany(Course_Instance, {
  foreignKey: "school_id",
  as: "course_instances",
});
Course_Instance.belongsTo(School, {
  foreignKey: "school_id",
  as: "school",
});

// School Year 1:M Course Instances
School_Year.hasMany(Course_Instance, {
  foreignKey: "school_year_id",
  as: "course_instances",
});
Course_Instance.belongsTo(School_Year, {
  foreignKey: "school_year_id",
  as: "school_year",
});

// Term 1:M Course Instances
Term.hasMany(Course_Instance, {
  foreignKey: "term_id",
  as: "course_instances",
});
Course_Instance.belongsTo(Term, { foreignKey: "term_id", as: "term" });

// Optional: Enrollment model to link Students to Course Instances
Student.hasMany(Enrollment, { foreignKey: "student_id", as: "enrollments" });
Enrollment.belongsTo(Student, { foreignKey: "student_id", as: "student" });

Course_Instance.hasMany(Enrollment, {
  foreignKey: "course_instance_id",
  as: "enrollments",
});
Enrollment.belongsTo(Course_Instance, {
  foreignKey: "course_instance_id",
  as: "course_instance",
});

// Student M:N Flag through StudentFlag
Student.belongsToMany(Flag, {
  through: StudentFlag,
  foreignKey: "student_id",
  otherKey: "flag_id",
  as: "flags",
});
Flag.belongsToMany(Student, {
  through: StudentFlag,
  foreignKey: "flag_id",
  otherKey: "student_id",
  as: "students",
});

// Student 1:M StudentFlag
Student.hasMany(StudentFlag, { foreignKey: "student_id" });
StudentFlag.belongsTo(Student, { foreignKey: "student_id" });

// Flag 1:M StudentFlag
Flag.hasMany(StudentFlag, { foreignKey: "flag_id" });
StudentFlag.belongsTo(Flag, { foreignKey: "flag_id" });

// Student belongs to School
Student.belongsTo(School, { foreignKey: "school_id", as: "school" });
School.hasMany(Student, { foreignKey: "school_id", as: "students" });

// Student 1:M Attendance
Student.hasMany(Attendance_Daily, {
  foreignKey: "student_id",
  as: "attendance",
});
Attendance_Daily.belongsTo(Student, {
  foreignKey: "student_id",
  as: "students",
});

SkillCategory.hasMany(Skill, { foreignKey: "category_id", as: "skills" });
Skill.belongsTo(SkillCategory, {
  foreignKey: "category_id",
  as: "skill_category",
});

Skill.hasMany(SkillScore, { foreignKey: "skill_id" });
SkillScore.belongsTo(Skill, { foreignKey: "skill_id" });

// Form Associations
Form.hasMany(Rubric_Sections, { foreignKey: "form_id", as: "rubric_sections" });
Rubric_Sections.belongsTo(Form, { foreignKey: "form_id", as: "form" });

Form.hasMany(ClassFormAssignment, {
  foreignKey: "form_id",
  as: "class_form_assignments",
});
ClassFormAssignment.belongsTo(Form, { foreignKey: "form_id", as: "form" });

Course_Instance.hasMany(ClassFormAssignment, {
  foreignKey: "class_id",
  as: "class_form_assignments",
});
ClassFormAssignment.belongsTo(Course_Instance, {
  foreignKey: "class_id",
  as: "course_instance",
});

Term.hasMany(ClassFormAssignment, {
  foreignKey: "period_id",
  as: "class_form_assignments",
});
ClassFormAssignment.belongsTo(Term, { foreignKey: "period_id", as: "term" });

ClassFormAssignment.hasMany(StudentForm, {
  foreignKey: "class_form_assignment_id",
  as: "student_forms",
});
StudentForm.belongsTo(ClassFormAssignment, {
  foreignKey: "class_form_assignment_id",
  as: "class_form_assignment",
});

StudentForm.belongsTo(Form, { foreignKey: "form_id", as: "form" });
Form.hasMany(StudentForm, { foreignKey: "form_id", as: "student_forms" });

Rubric_Sections.hasMany(Form_Static_Fields, {
  foreignKey: "rubric_section_id",
  as: "static_fields",
});
Form_Static_Fields.belongsTo(Rubric_Sections, {
  foreignKey: "rubric_section_id",
  as: "rubric_section",
});

Form.belongsToMany(Student, {
  through: StudentForm,
  foreignKey: "form_id",
  as: "students",
});
Student.belongsToMany(Form, {
  through: StudentForm,
  foreignKey: "student_id",
  as: "forms",
});

// Rubric Sections Associations
Rubric_Sections.hasMany(Rubric_Rows, {
  foreignKey: "rubric_section_id",
  as: "rubric_rows",
});
Rubric_Rows.belongsTo(Rubric_Sections, {
  foreignKey: "rubric_section_id",
  as: "rubric_section",
});

Rubric_Sections.hasMany(Rubric_Columns, {
  foreignKey: "rubric_section_id",
  as: "rubric_columns",
});
Rubric_Columns.belongsTo(Rubric_Sections, {
  foreignKey: "rubric_section_id",
  as: "rubric_section",
});

// Rubric Rows Associations
Rubric_Rows.hasMany(Rubric_Grades, {
  foreignKey: "rubric_row_id",
  as: "rubric_grades",
});
Rubric_Grades.belongsTo(Rubric_Rows, {
  foreignKey: "rubric_row_id",
  as: "rubric_row",
});

// Rubric Columns Associations
Rubric_Columns.hasMany(Rubric_Grades, {
  foreignKey: "rubric_column_id",
  as: "rubric_grades",
});
Rubric_Grades.belongsTo(Rubric_Columns, {
  foreignKey: "rubric_column_id",
  as: "rubric_column",
});

// Rubric Grades Associations
Rubric_Grades.belongsTo(Student, { foreignKey: "student_id", as: "student" });
Student.hasMany(Rubric_Grades, {
  foreignKey: "student_id",
  as: "rubric_grades",
});

// Form Static Fields Associations
Form_Static_Fields.hasMany(Form_Static_Values, {
  //form responses

  foreignKey: "form_static_field",
  as: "static_values",
});
Form_Static_Values.belongsTo(Form_Static_Fields, {
  foreignKey: "form_static_field",
  as: "static_field",
});

// Form Static Values Associations
Form_Static_Values.belongsTo(Student, {
  foreignKey: "student_id",
  as: "student",
});
Student.hasMany(Form_Static_Values, {
  foreignKey: "student_id",
  as: "static_values",
});

// WBL Associations
WBL_Catagories.hasMany(WBL_Hours, {
  foreignKey: "catagory_id",
  as: "wbl_hours",
});
WBL_Hours.belongsTo(WBL_Catagories, {
  foreignKey: "catagory_id",
  as: "category",
});

WBL_Hours.belongsTo(Student, {
  foreignKey: "student_id",
  as: "student",
});
Student.hasMany(WBL_Hours, {
  foreignKey: "student_id",
  as: "wbl_hours",
});

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
});
WBL_Deployments.hasMany(WBL_Deployment_Recipients, {
  foreignKey: "deployment_id",
  as: "recipients",
});

WBL_Deployment_Recipients.belongsTo(Student, {
  foreignKey: "student_id",
  as: "student",
});
Student.hasMany(WBL_Deployment_Recipients, {
  foreignKey: "student_id",
  as: "wbl_deployment_recipients",
});

// Assessments 1:M Scoring_Bands
Assessments.hasMany(Scoring_Bands, {
  foreignKey: "assessment_id",
  as: "scoring_bands",
});
Scoring_Bands.belongsTo(Assessments, {
  foreignKey: "assessment_id",
  as: "assessment",
});

// Assessments 1:M Student_Assessment_Results
Assessments.hasMany(Student_Assessment_Results, {
  foreignKey: "assessment_id",
  as: "student_results",
});
Student_Assessment_Results.belongsTo(Assessments, {
  foreignKey: "assessment_id",
  as: "assessment",
});

// Student 1:M Student_Assessment_Results
Student.hasMany(Student_Assessment_Results, {
  foreignKey: "student_id",
  as: "assessment_results",
});
Student_Assessment_Results.belongsTo(Student, {
  foreignKey: "student_id",
  as: "student",
});

// Scoring_Bands 1:M Student_Assessment_Results (optional, if band_id is used)
Scoring_Bands.hasMany(Student_Assessment_Results, {
  foreignKey: "band_id",
  as: "student_results",
});
Student_Assessment_Results.belongsTo(Scoring_Bands, {
  foreignKey: "band_id",
  as: "scoring_band",
});
// WBL Deployments Associations
WBL_Deployments.belongsTo(Staff, {
  foreignKey: "staff_id",
  as: "staff",
});
Staff.hasMany(WBL_Deployments, {
  foreignKey: "staff_id",
  as: "wbl_deployments",
});

// Student 1:M Student_Scores
Student.hasMany(Student_Scores, {
  foreignKey: "student_id",
  as: "student_scores",
});
Student_Scores.belongsTo(Student, {
  foreignKey: "student_id",
  as: "students",
});

Course_Instance.hasMany(Student_Scores, {
  foreignKey: "course_instance_id",
  as: "student_scores",
});
Student_Scores.belongsTo(Course_Instance, {
  foreignKey: "course_instance_id",
  as: "course_instance",
});

Task.hasMany(Student_Scores, {
  foreignKey: "task_id",
  as: "student_scores",
});
Student_Scores.belongsTo(Task, {
  foreignKey: "task_id",
  as: "task",
});

Student_Scores.belongsTo(Enrollment, {
  foreignKey: "enrollment_id",
  as: "enrollments",
});
Enrollment.hasMany(Student_Scores, {
  foreignKey: "enrollment_id",
  as: "student_scores",
});

Course_Instance.hasMany(Course_Instructors, {
  foreignKey: "course_instance_id",
  as: "course_instructors",
});
Course_Instructors.belongsTo(Course_Instance, {
  foreignKey: "course_instance_id",
  as: "course_instance",
});

Staff.hasMany(Course_Instructors, {
  foreignKey: "staff_id",
  as: "course_instructors",
});
Course_Instructors.belongsTo(Staff, {
  foreignKey: "staff_id",
  as: "staff",
});

Attendance_Daily.belongsTo(School, {
  foreignKey: "school_id",
  as: "school",
});
School.hasMany(Attendance_Daily, {
  foreignKey: "school_id",
  as: "attendance",
});

Attendance_Daily.belongsTo(Attendance_Status, {
  foreignKey: "attendance_status_id",
  as: "attendance_status",
});
Attendance_Status.hasMany(Attendance_Daily, {
  foreignKey: "attendance_status_id",
  as: "attendance",
});
