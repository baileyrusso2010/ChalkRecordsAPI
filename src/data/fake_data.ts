import { District } from "../models/district.model"
import { School } from "../models/school.model"

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
