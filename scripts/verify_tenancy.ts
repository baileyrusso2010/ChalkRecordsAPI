import * as dotenv from "dotenv"
dotenv.config()

import { Student } from "../src/models/student.model"
import { runWithTenant } from "../src/utils/tenant.context"
import sequelize from "../src/database"
import { District } from "../src/models/school/district.model"
import { School } from "../src/models/school/school.model"

async function verifyTenancy() {
    try {
        await sequelize.authenticate()
        console.log("Database connected.")

        // sync models lightly or just assume they exist?
        // We added columns, so we might need to sync or assume the user will migrate.
        // For now, let's try to sync just the Student model if possible, or force sync?
        // WARNING: force sync drops tables. explicit alter is safer or just letting it fail if col missing.
        // Given this is dev, let's try alter: true
        await District.sync({ alter: true })
        await School.sync({ alter: true })
        await Student.sync({ alter: true })

        // Create 2 Districts
        const d1 = await District.create({ name: "District A" })
        const d2 = await District.create({ name: "District B" })

        console.log(`Created Districts: ${d1.id}, ${d2.id}`)

        // Create Schools for Districts
        const s1 = await School.create({ name: "School A", district_id: d1.id })
        const s2 = await School.create({ name: "School B", district_id: d2.id })

        // Create Students in different districts
        let s1Id: number = 0

        // Create Student in District A
        await runWithTenant(d1.id, async () => {
            const s = await Student.create({
                first_name: "John",
                last_name: "Doe",
                student_id: "S001",
                school_id: s1.id,
            })
            s1Id = s.id
            console.log(`Created Student ${s.id} in District A`)
        })

        // Create Student in District B
        await runWithTenant(d2.id, async () => {
            await Student.create({
                first_name: "Jane",
                last_name: "Doe",
                student_id: "S002",
                school_id: s2.id,
            })
            console.log(`Created Student in District B`)
        })

        // VERIFY: Reading from District A should only show John
        await runWithTenant(d1.id, async () => {
            const students = await Student.findAll()
            console.log(`District A Students: ${students.length}`)
            if (students.find((s) => s.student_id === "S002")) {
                console.error("FAIL: Found District B student in District A context!")
            } else {
                console.log("PASS: District A isolation verified.")
            }
        })

        // VERIFY: Reading from District B should only show Jane
        await runWithTenant(d2.id, async () => {
            const students = await Student.findAll()
            console.log(`District B Students: ${students.length}`)
            if (students.find((s) => s.student_id === "S001")) {
                console.error("FAIL: Found District A student in District B context!")
            } else {
                console.log("PASS: District B isolation verified.")
            }
        })
    } catch (error) {
        console.error("Verification failed:", error)
    } finally {
        await sequelize.close()
    }
}

verifyTenancy()
