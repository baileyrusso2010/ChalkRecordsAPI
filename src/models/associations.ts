import { District } from "./district.model";
import { School } from "./school.model";
import { ProgramCatalog } from "./program_catalog.model";
import { Program } from "./program.model";
import { Course } from "./course.model";
import { CourseCatalog } from "./course_catalog.model";
import { Users } from "./users.model";
import { Enrollment } from "./enrollment.model";
import { Student } from "./students.model";
import { SchoolYear } from "./school_year.model";
import { Assignment } from "./assignment.model";
import { Grade } from "./grade.model";
import { SubCourse } from "./sub_course.model";
import { CourseSubCourse } from "./course_subcourse.model";

District.hasMany(School, { foreignKey: "district_id", as: "schools" });
School.belongsTo(District, { foreignKey: "id", as: "district" });

ProgramCatalog.hasMany(Program, {
  foreignKey: "program_catalog_id",
  as: "programs",
});
Program.belongsTo(ProgramCatalog, {
  foreignKey: "program_catalog_id",
  as: "program_catalog",
});

Course.belongsTo(Program, { foreignKey: "program_id", as: "program" });
Program.hasMany(Course, { foreignKey: "program_id", as: "courses" });

CourseCatalog.hasMany(Course, { foreignKey: "catalog_id", as: "courses" });
Course.belongsTo(CourseCatalog, {
  foreignKey: "catalog_id",
  as: "course_catalog",
});

Users.belongsTo(School, { foreignKey: "school_id", as: "school" });
School.hasMany(Users, { foreignKey: "school_id", as: "users" });

// User belongs to a District (optional)
Users.belongsTo(District, { foreignKey: "district_id", as: "district" });
District.hasMany(Users, { foreignKey: "district_id", as: "users" });
// A Course has one teacher (User), referenced by teacher_id in Course
Course.belongsTo(Users, { foreignKey: "teacher_id", as: "users" });
Users.hasMany(Course, { foreignKey: "teacher_id", as: "course" });

Enrollment.belongsTo(Student, { foreignKey: "studentId", as: "student" });
Student.hasMany(Enrollment, { foreignKey: "studentId", as: "enrollments" });

Enrollment.belongsTo(Course, { foreignKey: "classId" }); // or Class if that's your model
Course.hasMany(Enrollment, { foreignKey: "classId" });

Enrollment.belongsTo(SchoolYear, { foreignKey: "schoolYearId" });
SchoolYear.hasMany(Enrollment, { foreignKey: "schoolYearId" });

// Course -> Assignments
Course.hasMany(Assignment, { foreignKey: "courseId", as: "assignments" });
Assignment.belongsTo(Course, { foreignKey: "courseId", as: "course" });

// Assignment -> Grades
Assignment.hasMany(Grade, { foreignKey: "assignmentId", as: "grades" });
Grade.belongsTo(Assignment, { foreignKey: "assignmentId", as: "assignment" });

// Student -> Grades
Student.hasMany(Grade, { foreignKey: "studentId", as: "grades" });
Grade.belongsTo(Student, { foreignKey: "studentId", as: "student" });

// Many-to-Many: Course <-> SubCourse through CourseSubCourse
// Use snake_case FK names to match the join model/table columns
Course.belongsToMany(SubCourse, {
  through: CourseSubCourse,
  foreignKey: "course_id",
  otherKey: "sub_course_id",
  as: "subCourses",
});
SubCourse.belongsToMany(Course, {
  through: CourseSubCourse,
  foreignKey: "sub_course_id",
  otherKey: "course_id",
  as: "courses",
});
SubCourse.belongsTo(CourseCatalog, {
  foreignKey: "catalog_id",
  as: "course_catalog",
});
CourseCatalog.hasMany(SubCourse, {
  foreignKey: "catalog_id",
  as: "subcourses",
});

// Enable eager loading from the join model
CourseSubCourse.belongsTo(SubCourse, {
  foreignKey: "sub_course_id",
  as: "sub_course",
});
CourseSubCourse.belongsTo(Course, {
  foreignKey: "course_id",
  as: "course",
});

Users.hasMany(SubCourse, { foreignKey: "teacher_id", as: "subcourses" });
SubCourse.belongsTo(Users, { foreignKey: "teacher_id", as: "users" });

// Export all models for convenience
export { District, School };
