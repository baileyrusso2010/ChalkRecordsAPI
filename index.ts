const PORT = process.env.PORT || 3000
import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()

import sequelize from "./src/database"
import { authenticateJWT } from "./src/utils/auth.middleware"
import "./src/models/associations"
import studentRoutes from "./src/routes/student.routes"
import userRoutes from "./src/routes/user.routes"
import classRoutes from "./src/routes/class.routes"
import cteSchoolRoutes from "./src/routes/cte_school.routes"
import wblRoutes from "./src/routes/wbl.routes"
import technicalRoutes from "./src/routes/technical.routes"
import performanceRoutes from "./src/routes/performance.routes"
import { generateFakeData } from "./src/data/fake_data"

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

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
    // await generateFakeData()

    console.log(`Server is running on port ${PORT}`)
})

// Public routes
app.use("/api", userRoutes) // /register and /login are public

// Protect all other /api routes
app.use("/api", (req, res, next) => {
    if (req.path === "/register" || req.path === "/login") {
        return next()
    }
    authenticateJWT(req, res, next)
})
app.use("/api", studentRoutes)
app.use("/api", classRoutes)
app.use("/api", cteSchoolRoutes)
app.use("/api", wblRoutes)
app.use("/api", technicalRoutes)
app.use("/api", performanceRoutes)
