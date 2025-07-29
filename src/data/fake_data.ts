import { Student } from "../models/student.model"
import { CTESchool } from "../models/cte_school.model"
import { SchoolDistricts } from "../models/school_district.model"
import { Program } from "../models/program.model"
import { Staff } from "../models/staff.model"
import { faker } from "@faker-js/faker"
import { Flag } from "../models/associations"
import { Class } from "../models/classes.model"
import { ClassStudents } from "../models/associations"

async function generateCTESchoolData() {
    await CTESchool.bulkCreate([
        {
            name: "CTE School A",
        },
        { name: "CTE School B" },
    ])
        .then(() => {
            console.log("CTE Schools created successfully.")
        })
        .catch((error) => {
            console.error("Error creating CTE Schools:", error)
        })
}

async function generateSchoolDistrictData() {
    await SchoolDistricts.bulkCreate([
        {
            name: "District A",
            abbreviation: "DA",
        },
        {
            name: "District B",
            abbreviation: "DB",
        },
    ])
        .then(() => {
            console.log("School Districts created successfully.")
        })
        .catch((error) => {
            console.error("Error creating School Districts:", error)
        })
}

async function generateProgramData() {
    await Program.bulkCreate([
        {
            name: "Welding",
        },
        {
            name: "Culinary Arts",
        },
        {
            name: "Information Technology",
        },
    ])
        .then(() => {
            console.log("Programs created successfully.")
        })
        .catch((error) => {
            console.error("Error creating Programs:", error)
        })
}

async function generateStaffData() {
    try {
        await Staff.bulkCreate([
            {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                cte_schoolId: 1, // Assuming CTE School A has ID 1
                role: "Instructor",
                start_date: faker.date.past(),
                end_date: faker.date.future(),
            },
            {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                cte_schoolId: 2, // Assuming CTE School B has ID 2
                role: "Counselor",
                start_date: faker.date.past(),
                end_date: faker.date.future(),
            },
        ])
        console.log("Staff members created successfully.")
    } catch (error: any) {
        console.error("Error creating Staff members:", error)
    }
}

async function generateClassData() {
    try {
        await Class.bulkCreate([
            {
                name: "Advanced Welding",
                programId: 1, // Assuming Welding program has ID 1
                cte_schoolId: 1, // Assuming CTE School A has ID 1
                teacherId: 1, // Assuming Staff member with ID 1 is the teacher
            },
            {
                name: "Culinary Basics",
                programId: 2, // Assuming Culinary Arts program has ID 2
                cte_schoolId: 2, // Assuming CTE School B has ID 2
                teacherId: 2, // Assuming Staff member with ID 2 is the teacher
            },
        ])
        console.log("Classes created successfully.")
    } catch (error: any) {
        console.error("Error creating Classes:", error)
    }
}

async function generateStudentData() {
    try {
        const students = []
        for (let i = 0; i < 20; i++) {
            students.push({
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                student_id: faker.string.numeric(8),
                gender: faker.person.gender(),
                dateOfBirth: faker.date.birthdate({ min: 15, max: 18, mode: "age" }),
                email: faker.internet.email(),
                grade: faker.number.int({ min: 9, max: 12 }),
                race: faker.helpers.arrayElement([
                    "White",
                    "Black or African American",
                    "Asian",
                    "American Indian or Alaska Native",
                    "Native Hawaiian or Other Pacific Islander",
                ]),
                hispanic: faker.datatype.boolean(),
                counslorId: faker.number.int({ min: 1, max: 2 }), // Assuming 2 counselors exist
                cteSchoolId: faker.number.int({ min: 1, max: 2 }), // Assuming 2 CTE schools exist
                schoolDistrictId: faker.number.int({ min: 1, max: 2 }), // Assuming 2 districts exist
            })
        }
        await Student.bulkCreate(students)
        console.log("Students created successfully.")
    } catch (error: any) {
        console.error("Error creating Students:", error)
    }
}

async function generate_student_classes() {
    // Get all classes
    const classes = await Class.findAll()
    // Get all students
    const students = await Student.findAll()

    // Assign each student to a random class
    const classStudents = students.map((student) => {
        const randomClass = classes[Math.floor(Math.random() * classes.length)]
        return {
            class_id: randomClass.id,
            student_id: student.id,
            school_year: "2025",
        }
    })

    await ClassStudents.bulkCreate(classStudents)
    console.log("Student-Class associations created successfully.")
}

async function generateFlags() {
    try {
        // Assuming Flag model exists and has been defined
        await Flag.bulkCreate([{ name: "IEP" }, { name: "504" }, { name: "Econ Dis." }])
        console.log("Flags created successfully.")
    } catch (error: any) {
        console.error("Error creating Flags:", error)
    }
}

export async function generateFakeData() {
    await generateCTESchoolData()
    await generateSchoolDistrictData()
    await generateProgramData()
    await generateStaffData()
    await generateClassData()
    await generateStudentData()
    await generateFlags()
    await generate_student_classes()
}
