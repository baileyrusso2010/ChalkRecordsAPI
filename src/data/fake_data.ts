import { District } from "../models/district.model"
import { School } from "../models/school.model"
import { Student } from "../models/students.model"
import { Users } from "../models/users.model"
import { Faker } from "@faker-js/faker/."

export async function generateSchoolDistrict() {
    try {
        // Assuming Flag model exists and has been defined
        await District.create({ name: "School Test" })
        // console.log("Flags created successfully.")
    } catch (error: any) {
        console.error("Error creating Flags:", error)
    }
}

export async function generateSchool() {
    try {
        // Assuming Flag model exists and has been defined
        await School.create({ name: "School Test", district_id: 1 })
        // console.log("Flags created successfully.")
    } catch (error: any) {
        console.error("Error creating Flags:", error)
    }
}

export async function generateStudents() {
    try {
        // Assuming Flag model exists and has been defined
        await Student.create({
            firstName: "Tom",
            lastName: "Say",
            email: "tomsay@gmail.com",
        })
        // console.log("Flags created successfully.")
    } catch (error: any) {
        console.error("Error creating Flags:", error)
    }
}

export async function generateUsers() {
    try {
        await Users.create({
            email: "baileyrusso@gmail.com",
            name: "Bailey Russo",
            role: "Teacher",
        })
    } catch (error: any) {
        console.error("Error creating Users:", error)
    }
}
