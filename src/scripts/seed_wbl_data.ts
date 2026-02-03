import dotenv from "dotenv"
import path from "path"
dotenv.config({ path: path.resolve(__dirname, "../../.env") })

import sequelize from "../database"
import { WBL_Catagories } from "../models/wbl/wbl_catagories.model"
import { WBL_Hours } from "../models/wbl/wbl_hours.model"
import { Student } from "../models/student.model"
import { Enrollment } from "../models/enrollment.model"

// WBL Category definitions
const WBL_CATEGORIES = [
    { name: "Internship" },
    { name: "Job Shadowing" },
    { name: "Community Service" },
    { name: "Apprenticeship" },
    { name: "Mentorship" },
    { name: "Career Exploration" },
    { name: "Industry Project" },
]

// Sample comments for realistic data
const sampleComments = [
    "Assisted with database migration planning and documentation.",
    "Shadowed senior developer during code review session.",
    "Helped set up local tech meet-up event.",
    "Worked on front-end UI improvements for client project.",
    "Participated in team standup and sprint planning.",
    "Conducted user research interviews with stakeholders.",
    "Collaborated on wireframe designs for new mobile app.",
    "Assisted with network troubleshooting and maintenance.",
    "Helped organize career fair booth and materials.",
    "Observed healthcare professionals during patient rounds.",
    "Supported data entry and administrative tasks.",
    "Assisted with marketing campaign analysis.",
    "Participated in construction site safety training.",
    "Helped with customer service and client communications.",
    "Worked on inventory management system updates.",
    "Observed manufacturing processes and quality control.",
    "Assisted with financial data analysis and reporting.",
    "Participated in environmental sustainability project.",
    "Helped coordinate youth mentorship program activities.",
    "Worked on graphic design assets for nonprofit.",
]

// Generate a random date within the last 6 months
function randomDate(): string {
    const now = new Date()
    const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000)
    const randomTime =
        sixMonthsAgo.getTime() + Math.random() * (now.getTime() - sixMonthsAgo.getTime())
    const date = new Date(randomTime)
    return date.toISOString().split("T")[0] // YYYY-MM-DD format
}

// Generate random hours (0.5 to 8 hours, in 0.5 increments)
function randomHours(): number {
    const increments = Math.floor(Math.random() * 16) + 1 // 1-16 increments
    return increments * 0.5
}

// Pick random item from array
function pickRandom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)]
}

async function seedWblData() {
    try {
        await sequelize.authenticate()
        console.log("Database connected.")

        // Sync models
        await WBL_Catagories.sync({ alter: true })
        await WBL_Hours.sync({ alter: true })

        // 1. Seed WBL Categories
        console.log("\n--- Seeding WBL Categories ---")
        const categoryMap: Record<string, number> = {}

        for (const cat of WBL_CATEGORIES) {
            const [category, created] = await WBL_Catagories.findOrCreate({
                where: { name: cat.name },
                defaults: cat,
            })
            categoryMap[cat.name] = category.id
            if (created) {
                console.log(`Created category: ${cat.name}`)
            } else {
                console.log(`Category exists: ${cat.name}`)
            }
        }

        // 2. Get all students (via enrollments or directly)
        console.log("\n--- Fetching students ---")
        const students = await Student.findAll({
            attributes: ["id", "first_name", "last_name"],
            limit: 100, // Limit to avoid overwhelming data
        })

        console.log(`Found ${students.length} students`)

        if (students.length === 0) {
            console.log("No students found. Skipping WBL hours seeding.")
            return
        }

        // 3. Seed WBL Hours for each student
        console.log("\n--- Seeding WBL Hours ---")
        const categoryIds = Object.values(categoryMap)
        let totalCreated = 0
        let totalSkipped = 0

        for (const student of students) {
            // Random number of WBL entries per student (0-8)
            const numEntries = Math.floor(Math.random() * 9)

            for (let i = 0; i < numEntries; i++) {
                const categoryId = pickRandom(categoryIds)
                const hours = randomHours()
                const date = randomDate()
                const comments = pickRandom(sampleComments)

                // Check if a similar entry exists (same student, date, category)
                const existing = await WBL_Hours.findOne({
                    where: {
                        student_id: student.id,
                        catagory_id: categoryId,
                        date: date,
                    },
                })

                if (existing) {
                    totalSkipped++
                    continue
                }

                await WBL_Hours.create({
                    student_id: student.id,
                    catagory_id: categoryId,
                    hours,
                    date,
                    comments,
                })
                totalCreated++
            }

            const studentName = `${student.first_name} ${student.last_name}`
            console.log(`Seeded ${numEntries} WBL entries for ${studentName}`)
        }

        console.log(`\n--- Summary ---`)
        console.log(`Total WBL hours entries created: ${totalCreated}`)
        console.log(`Total entries skipped (duplicates): ${totalSkipped}`)
        console.log("WBL data seeding complete!")
    } catch (err) {
        console.error("Seeding failed:", err)
    } finally {
        await sequelize.close()
    }
}

seedWblData()
