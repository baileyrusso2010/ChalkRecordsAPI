import { faker } from "@faker-js/faker";
import { Student } from "../models/student.model";
import { StudentFlag } from "../models/flags/student_flags.model";
import { Flag } from "../models/flags/flag.model";
import { School } from "../models/school/school.model";
import { School_Year } from "../models/term/school_year.model";
import { District_Program } from "../models/program/district_program.model";
import { Course_Catalog } from "../models/course/course_catalog.model";
import { Course_Instance } from "../models/course/course_instance.model";
import { Enrollment } from "../models/enrollment.model";
import { Staff } from "../models/staff.model";
import { Program_Catalog } from "../models/program/program_catalog.model";
import { District } from "../models/school/district.model";
import { Attendance } from "../models/attendance.model";
import { BehaviorType } from "../models/behavior/behavior_type.model";
import { Behavior } from "../models/behavior/behavior.model";

/**
 * Generate a correlated grade and age for K-12 students
 * Grades: K, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
 * Ages: 5-19 (with correlation to grade)
 * Kindergarten (K) = typically age 5-6
 * Each grade adds ~1 year, with some variation (±1 year)
 */
function generateGradeAndAge(): { grade: string; age: number } {
  const grades = ["K", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
  const gradeIndex = faker.number.int({ min: 0, max: 12 });
  const grade = grades[gradeIndex];
  
  // Base age for kindergarten is 5, each grade adds 1 year
  const baseAge = 5 + gradeIndex;
  
  // Add some variation (±1 year) to make it realistic
  // Some students are held back or skip grades
  const ageVariation = faker.helpers.arrayElement([-1, 0, 0, 0, 1]); // More likely to be typical age
  const age = Math.max(5, Math.min(19, baseAge + ageVariation)); // Clamp between 5-19
  
  return { grade, age };
}

async function createDistrict(name: String = "Default"){

  let district = await District.create({
      name,
      address: faker.location.streetAddress(),
      contact_email: faker.internet.email(),
      phone_number: "123-456-7890",
    });
    return district.id; 

}

export async function createSchool(name: string, district_id?: number) {
    
    let school = await School.create({ name, district_id });

    return school.id;
}



export async function createStudent(id: any, school_id: number, district_id?: number) {
  const { grade, age } = generateGradeAndAge();

  let _student = await Student.create({
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    student_id: id,
    grade,
    age,
    school_id,
    gender: faker.helpers.arrayElement(["Male", "Female", "Other"]),
  });

  return _student.id;
}

export async function createTeacher() {

  let _staff = await Staff.create({
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    staff_id: faker.string.numeric(5),
  })

    return _staff.id;
}

async function createCourseInstance(school_id: number, instructor_id: number){

  let courses = await Course_Catalog.findAll();

  let randomCourse = courses[Math.floor(Math.random() * courses.length)];

  let _c = await Course_Instance.create({
    school_id,
    course_catalog_id: randomCourse.id,
    alias: randomCourse.title,
    instructorId: instructor_id,
    // school_year_id: 1,
    start_date: faker.date.past(),
    end_date: faker.date.future(),
  })

  return _c.id;

}

async function createEnrollment( student_id: number, course_instance_id: number){

  let _e = await Enrollment.create({
    student_id,
    course_instance_id,
    enrollment_date: faker.date.past(),
  })

  return _e.id

}


export async function createFakeData(){

  let fakeDistrict = await createDistrict("Aurora School District");
  let fakeSchool = await createSchool("Aurora High School", fakeDistrict);

  let students = []
  let teachers = [] 
  let courses = []
  let enrollments = []

  for (let i = 0; i < 100; i++) {
    students.push(await createStudent(i, fakeSchool))
  }

  for (let i = 0; i < 10; i++) {
    teachers.push(await createTeacher())
  }

  for (let i = 0; i < 10; i++) {
    courses.push(await createCourseInstance(fakeSchool, teachers[Math.floor(Math.random() * teachers.length)]))
  }

  for(let i = 0; i < 10; i++){
    let _e = await createEnrollment(students[Math.floor(Math.random() * students.length)], courses[Math.floor(Math.random() * courses.length)])
    enrollments.push(_e)
  }

}

export async function createAttendance(){

  let students = await Student.findAll()
  let enrollments = await Enrollment.findAll()

  for(let i = 0; i < students.length; i++){
    //create for the past month
    for(let j = 0; j < 30; j++){
      await Attendance.create({
        student_id: students[i].id,
        enrollment_id: enrollments[Math.floor(Math.random() * enrollments.length)].id,//kind of bad but it works
        attendance_date: faker.date.past(),
        code: faker.helpers.arrayElement(["P", "A", "T", "E", "U"]),
    })
    }
  }
}

export async function createBehavior(){

  // let b_types = ["Insubordination", "Disrespect", "Tardiness", "Truancy", "Suspension"]

  // b_types.forEach(async (type) => {
  //   await BehaviorType.create({
  //     name: type,
  //     code: faker.string.numeric(5),
  //   })
  // })

  let staff = await Staff.findAll()

  let all_types = await BehaviorType.findAll()

  let students = await Student.findAll()

  for(let i = 0; i < students.length; i += 3){
    //create for the past month
    for(let j = 0; j < 3; j++){
      await Behavior.create({
        student_id: students[i].id,
        staff_id: staff[Math.floor(Math.random() * staff.length)].id,
        behavior_type_id: all_types[Math.floor(Math.random() * all_types.length)].id,
        date: faker.date.past(),
    })
    }
  }

}