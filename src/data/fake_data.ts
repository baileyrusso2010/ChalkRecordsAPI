import { Course } from "../models/course/course.model"
import { CourseCatalog } from "../models/course/course_catalog.model"
import { District } from "../models/district.model"
import { Enrollment } from "../models/enrollment.model"
import { Program } from "../models/program.model"
import { School } from "../models/school.model"
import { Student } from "../models/students.model"
import { Users } from "../models/users.model"
import { faker } from "@faker-js/faker"

async function generateSchoolDistrict() {
    try {
        // Assuming Flag model exists and has been defined
        const district = (await District.create({
            name: "Orleans/Niagra",
        })) as District
        const districtId = district.id
        return districtId
    } catch (error: any) {
        console.error("Error creating Flags:", error)
    }
}

async function generateSchool(id: any) {
    try {
        // Assuming Flag model exists and has been defined
        await School.create({ name: "Orleans", district_id: id })
        // console.log("Flags created successfully.")
    } catch (error: any) {
        console.error("Error creating Flags:", error)
    }
}

async function generateStudents() {
    try {
        // Assuming Flag model exists and has been defined
        const students = Array.from({ length: 50 }).map(() => ({
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
        }))
        await Student.bulkCreate(students)
        // console.log("Flags created successfully.")
    } catch (error: any) {
        console.error("Error creating Flags:", error)
    }
}

async function generateUsers() {
    try {
        const teachers = Array.from({ length: 10 }).map(() => ({
            email: faker.internet.email(),
            name: faker.person.firstName() + " " + faker.person.lastName(),
            role: "Teacher",
        }))

        await Users.bulkCreate(teachers)
    } catch (error: any) {
        console.error("Error creating Users:", error)
    }
}

async function fillOutClasses() {
    try {
        const courses = (await CourseCatalog.findAll({})) as CourseCatalog[]
        const programs = (await Program.findAll({})) as Program[]
        const users = (await Users.findAll({
            where: { role: "Teacher" },
        })) as Users[]
        const schoolId = (await School.findOne()) as School | null

        const _courses = Array.from({ length: 10 }).map(() => {
            const course = courses[Math.floor(Math.random() * courses.length)] as CourseCatalog
            const program = programs[Math.floor(Math.random() * programs.length)] as Program
            const user = users[Math.floor(Math.random() * users.length)] as Users
            const courseName = course.course_name
            return {
                catalog_id: course.id,
                program_id: program.id,
                teacher_id: user.id,
                alias: `${courseName}`,
                school_year: "2023-2024",
                school_id: schoolId?.id,
            }
        })

        await Course.bulkCreate(_courses)
        // Here you might insert into a Course table if defined elsewhere
    } catch (error: any) {
        console.error("Error creating Users:", error)
    }
}

async function generateEnrollments() {
    const students = await Student.findAll()
    const courses = await Course.findAll()

    if (!students.length || !courses.length) {
        console.error("No students or courses found for enrollment generation.")
        return
    }

    const enrollment = students
        .filter((student) => student && student.id != null)
        .map((student) => {
            const randomCourse = courses[Math.floor(Math.random() * courses.length)]
            if (!randomCourse || randomCourse.id == null) {
                throw new Error("Invalid course found during enrollment generation.")
            }
            console.log(student.id, randomCourse.id)
            // Use model attribute names (camelCase) so Sequelize maps them to snake_case columns.
            return {
                studentId: student.id,
                classId: randomCourse.id,
                schoolYearId: 2,
            }
        })
    await Enrollment.bulkCreate(enrollment)
}

export default async function generateFakeData() {
    const districtId = await generateSchoolDistrict()
    if (districtId) await generateSchool(districtId)
    await generateStudents()
    await generateUsers()
    await fillOutClasses()
    await generateEnrollments()
}
