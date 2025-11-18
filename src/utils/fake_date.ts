import { faker } from "@faker-js/faker";
import { Student } from "../models/student.model";
import { StudentFlag } from "../models/flags/student_flags.model";
import { Flag } from "../models/flags/flag.model";
import { CTE_School } from "../models/school/cte_school.model";
import { School_Year } from "../models/term/school_year.model";
import { CTE_District_Program } from "../models/program/cte_district_program.model";
import { Course_Catalog } from "../models/course/course_catalog.model";
import { Course_Instance } from "../models/course/course_instance.model";
import { Enrollment } from "../models/enrollment.model";
import { Staff } from "../models/staff.model";
import { Home_School } from "../models/school/home_school.model";
import { Program_Catalog } from "../models/program/program_catalog.model";

export async function createStudent(
  id: any,
  first_name: string,
  last_name: string,
  homeschool: string
) {
  let school = await Home_School.findOne({ where: { name } });

  if (!school) {
    school = await Home_School.create({
      cte_school_id: 1, //change later
      name: homeschool,
    });
  }

  await Student.create({
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    student_id: id,
    grade: faker.helpers.arrayElement(["11", "12"]),
    age: faker.number.int({ min: 15, max: 19 }),
    home_school_id: school.id,
    cte_school_id: 1,
    gender: faker.helpers.arrayElement(["Male", "Female", "Other"]),
  });
}

export async function createteacher(
  staff_id: any,
  last_name: string,
  first_name: string = ""
) {
  let staff = await Staff.findOne({ where: { staff_id } });

  if (staff) {
    return staff.id;
  } else {
    staff = await Staff.create({
      staff_id,
      first_name, //blank for now
      last_name: last_name.split(" ")[1], //not first name
    });
    return staff.id;
  }
}

export async function createCTESchool(name: string) {
  let school = await CTE_School.findOne({ where: { name } });

  if (school) {
    return school.id;
  } else {
    school = await CTE_School.create({ name, district_id: 1 });
    return school.id;
  }
}

export async function importFromCSV(csvRows: any[]) {
  for (const row of csvRows) {
    let home_school = await Home_School.findOne({
      where: { name: row.home_school_district },
    });

    if (!home_school) {
      home_school = await Home_School.create({
        cte_school_id: 1, //change later
        name: row.home_school_district,
      });
    }

    let cte_school = await CTE_School.findOne({
      where: { name: row.cte_school },
    });

    if (!cte_school) {
      cte_school = await CTE_School.create({
        name: row.cte_school,
        district_id: 1,
      });
    }

    let staff = await Staff.findOne({ where: { staff_id: row.teacher_id } });

    if (!staff?.id) {
      staff = await Staff.create({
        staff_id: row.teacher_id,
        first_name: "Test", //blank for now
        last_name: row.teacher_name.split(" ")[1], //not first name
      });
    }
    //create student
    let student = await Student.create({
      first_name: row.first_name,
      last_name: row.last_name,
      student_id: row.student_id,
      grade: faker.helpers.arrayElement(["11", "12"]),
      age: faker.number.int({ min: 15, max: 19 }),
      home_school_id: home_school.id,
      cte_school_id: 1,
      gender: faker.helpers.arrayElement(["Male", "Female", "Other"]),
    });

    console.log(row.cte_program_code);
    let program = await Program_Catalog.findOne({
      where: { state_program_code: row.cte_program_code },
    });

    let course = await Course_Catalog.findOne({
      where: { course_code: row.cte_course_code },
    });

    if (!course) {
      console.error(`Course not found for code: ${row.cte_course_code}`);
    }

    let cte_program = await CTE_District_Program.findOne({
      where: { program_id: program?.id },
    });

    if (!cte_program) {
      cte_program = await CTE_District_Program.create({
        cte_district_id: 1,
        program_id: program?.id,
      });
    }

    let course_instance = await Course_Instance.findOne({
      where: {
        course_catalog_id: course?.id,
        district_program_id: cte_program.id,
      },
    });

    if (!course_instance) {
      course_instance = await Course_Instance.create({
        cte_school_id: 1,
        course_catalog_id: course?.id,
        alias: program?.title,
        district_program_id: cte_program.id,
        instructorId: staff.id,
      });
    }

    await Enrollment.create({
      student_id: student.id,
      course_instance_id: course_instance.id,
    });
  } //end of for
}

// export async function createCourseInstances(_count = 10) {
//   const cte_school = await CTE_School.findAll();
//   const district_programs = await CTE_District_Program.findAll();
//   const course_catalog = await Course_Catalog.findAll();
//   const school_year = await School_Year.findAll();

//   const uniqueCombinations = new Set<string>(); // Track unique combinations
//   const course_instances: any[] = [];

//   while (course_instances.length < _count) {
//     const cteSchoolId = faker.helpers.arrayElement(cte_school).id;
//     const districtProgramId = faker.helpers.arrayElement(district_programs).id;
//     const courseCatalogId = faker.helpers.arrayElement(course_catalog).id;
//     // const schoolYearId = faker.helpers.arrayElement(school_year).id

//     const instructorId = faker.helpers.arrayElement(await Staff.findAll()).id;

//     //create the class for each school year
//     for (let i = 0; i < school_year.length; i++) {
//       const comboKey = `${cteSchoolId}-${districtProgramId}-${courseCatalogId}-${school_year[i].id}`;
//       if (!uniqueCombinations.has(comboKey)) {
//         uniqueCombinations.add(comboKey);
//         course_instances.push({
//           cte_school_id: cteSchoolId,
//           district_program_id: districtProgramId,
//           course_catalog_id: courseCatalogId,
//           alias: faker.lorem.words(2),
//           school_year_id: school_year[i].id,
//           instructorId: instructorId,
//         });
//       }
//     }
//   }

//   await Course_Instance.bulkCreate(course_instances);
// }

// export async function createEnrollments(_count = 10) {
//   const students = await Student.findAll();
//   const course_instances = await Course_Instance.findAll();

//   const uniquePairs = new Set<string>(); // Track unique student_id-course_instance_id pairs
//   const enrollments: any[] = [];

//   while (enrollments.length < _count) {
//     const studentId = faker.helpers.arrayElement(students).id;
//     const courseInstanceId = faker.helpers.arrayElement(course_instances).id;
//     const schoolYearId =
//       faker.helpers.arrayElement(course_instances).school_year_id;
//     const pairKey = `${studentId}-${courseInstanceId}-${schoolYearId}`;

//     if (!uniquePairs.has(pairKey)) {
//       uniquePairs.add(pairKey);
//       enrollments.push({
//         student_id: studentId,
//         course_instance_id: courseInstanceId,
//         enrollment_date: faker.date.past(),
//       });
//     }
//   }

//   await Enrollment.bulkCreate(enrollments);
// }
