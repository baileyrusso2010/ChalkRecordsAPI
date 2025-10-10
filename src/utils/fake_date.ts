import { faker } from "@faker-js/faker"
import { Student } from "../models/student.model"

function createRandomStudents() {
    const _student = () => {
        return {
            first_name: faker.name.firstName(),
            last_name: faker.name.lastName(),
            student_id: faker.string.uuid().slice(0, 8),
            grade: faker.helpers.arrayElement(["9", "10", "11", "12"]),
            age: faker.number.int({ min: 14, max: 19 }),
            home_school_id: 1,
            cte_school_id: 1,
        }
    }

    const users = faker.helpers.multiple(_student, {
        count: 10,
    })
    Student.bulkCreate(users)
}

async function createStudentEnrollments() {
    await Student.findAll().then((students) => {
        students.forEach((student) => {
            console.log(student.get())
        })
    })

    const _enrollment = () => {
        return {
            student_id: faker.number.int({ min: 1, max: 10 }),
            course_instance_id: faker.number.int({ min: 1, max: 10 }),
            enrollment_date: faker.date.past({ years: 1 }),
        }
    }
}
