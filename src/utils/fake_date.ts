import { faker } from "@faker-js/faker"
import { Student } from "../models/student.model"
import { StudentFlag } from "../models/flags/student_flags.model"
import { Flag } from "../models/flags/flag.model"
import { CTE_School } from "../models/school/cte_school.model"
import { School_Year } from "../models/term/school_year.model"
import { CTE_District_Program } from "../models/program/cte_district_program.model"
import { Course_Catalog } from "../models/course/course_catalog.model"
import { Course_Instance } from "../models/course/course_instance.model"
import { Enrollment } from "../models/enrollment.model"
import { Staff } from "../models/staff.model"

export function createRandomStudents(_count = 10) {
    const uniqueIds = new Set<string>() // Track unique student_id values
    const users: any[] = []

    while (users.length < _count) {
        const studentId = faker.string.uuid().slice(0, 8)
        if (!uniqueIds.has(studentId)) {
            uniqueIds.add(studentId)
            users.push({
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                student_id: studentId,
                grade: faker.helpers.arrayElement(["11", "12"]),
                age: faker.number.int({ min: 14, max: 19 }),
                home_school_id: 1,
                cte_school_id: 1,
                gender: faker.helpers.arrayElement(["Male", "Female", "Other"]),
            })
        }
    }

    Student.bulkCreate(users)
}

export async function createRandomFlags(_count = 10) {
    const students = await Student.findAll()
    const flags = await Flag.findAll()

    const uniquePairs = new Set<string>() // Track unique student_id-flag_id pairs
    const _flags: { student_id: number; flag_id: number }[] = []

    while (_flags.length < _count) {
        const studentId = faker.helpers.arrayElement(students).id
        const flagId = faker.helpers.arrayElement(flags).id
        const pairKey = `${studentId}-${flagId}`

        if (!uniquePairs.has(pairKey)) {
            uniquePairs.add(pairKey)
            _flags.push({ student_id: studentId, flag_id: flagId })
        }
    }

    await StudentFlag.bulkCreate(_flags)
}

export async function createCourseInstances(_count = 10) {
    const cte_school = await CTE_School.findAll()
    const district_programs = await CTE_District_Program.findAll()
    const course_catalog = await Course_Catalog.findAll()
    const school_year = await School_Year.findAll()

    const uniqueCombinations = new Set<string>() // Track unique combinations
    const course_instances: any[] = []

    while (course_instances.length < _count) {
        const cteSchoolId = faker.helpers.arrayElement(cte_school).id
        const districtProgramId = faker.helpers.arrayElement(district_programs).id
        const courseCatalogId = faker.helpers.arrayElement(course_catalog).id
        // const schoolYearId = faker.helpers.arrayElement(school_year).id

        const instructorId = faker.helpers.arrayElement(await Staff.findAll()).id

        //create the class for each school year
        for (let i = 0; i < school_year.length; i++) {
            const comboKey = `${cteSchoolId}-${districtProgramId}-${courseCatalogId}-${school_year[i].id}`
            if (!uniqueCombinations.has(comboKey)) {
                uniqueCombinations.add(comboKey)
                course_instances.push({
                    cte_school_id: cteSchoolId,
                    district_program_id: districtProgramId,
                    course_catalog_id: courseCatalogId,
                    alias: faker.lorem.words(2),
                    school_year_id: school_year[i].id,
                    instructorId: instructorId,
                })
            }
        }
    }

    await Course_Instance.bulkCreate(course_instances)
}

export async function createEnrollments(_count = 10) {
    const students = await Student.findAll()
    const course_instances = await Course_Instance.findAll()

    const uniquePairs = new Set<string>() // Track unique student_id-course_instance_id pairs
    const enrollments: any[] = []

    while (enrollments.length < _count) {
        const studentId = faker.helpers.arrayElement(students).id
        const courseInstanceId = faker.helpers.arrayElement(course_instances).id
        const schoolYearId = faker.helpers.arrayElement(course_instances).school_year_id
        const pairKey = `${studentId}-${courseInstanceId}-${schoolYearId}`

        if (!uniquePairs.has(pairKey)) {
            uniquePairs.add(pairKey)
            enrollments.push({
                student_id: studentId,
                course_instance_id: courseInstanceId,
                enrollment_date: faker.date.past(),
            })
        }
    }

    await Enrollment.bulkCreate(enrollments)
}
