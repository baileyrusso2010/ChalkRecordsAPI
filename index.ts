const PORT = process.env.PORT || 3000
import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()

import sequelize from "./src/database"
import "./src/models/associations"
import {
    generateSchoolDistrict,
    generateSchool,
    generateUsers,
    generateStudents,
} from "./src/data/fake_data"

import courseRoutes from "./src/routes/course.routes"
import programRoutes from "./src/routes/program.routes"
import userRoutes from "./src/routes/user.routes"
import studentRoutes from "./src/routes/student.routes"
import wblRoutes from "./src/routes/wbl.routes"
import assignmentRoutes from "./src/routes/assignment.routes"
import gradeRoutes from "./src/routes/grade.routes"
import attendanceRoutes from "./src/routes/attendance.routes"
import attendanceTypeRoutes from "./src/routes/attendance_type.routes"

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Unified API prefix; each router defines its own resource paths (e.g. /courses, /programs, /teachers, /classes/:id/students, /enrollments)
app.use("/api", courseRoutes)
app.use("/api", programRoutes)
app.use("/api", userRoutes)
app.use("/api", studentRoutes)
app.use("/api", wblRoutes)
app.use("/api", assignmentRoutes)
app.use("/api", gradeRoutes)
app.use("/api", attendanceRoutes)
app.use("/api", attendanceTypeRoutes)

app.listen(PORT, async () => {
    await sequelize
        .authenticate()
        .then(async () => {
            console.log("Database connection has been established successfully.")
        })
        .catch((error: any) => {
            console.error("Unable to connect to the database:", error)
        })

    await sequelize.sync({ alter: true }) // Use force: true only in development to drop and recreate tables
    // await generateStudents()
    // await generateSchoolDistrict()
    // await generateSchool()
    // await generateUsers()

    console.log(`Server is running on port ${PORT}`)
})
