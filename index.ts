const PORT = process.env.PORT || 3000
import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()

import sequelize from "./src/database"
import "./src/models/associations"
import { generateSchoolDistrict, generateSchool, generateUsers } from "./src/data/fake_data"

import courseRoutes from "./src/routes/course.routes"
import programRoutes from "./src/routes/program.routes"
import teacherRoutes from "./src/routes/user.routes"

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use("/api/courses", courseRoutes)
app.use("/api/programs", programRoutes)
app.use("/api/teachers", teacherRoutes)

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
    // await generateSchoolDistrict()
    // await generateSchool()
    // await generateUsers()

    console.log(`Server is running on port ${PORT}`)
})
