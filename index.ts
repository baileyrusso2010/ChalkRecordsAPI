const PORT = process.env.PORT || 3000
import * as bodyParser from "body-parser"
import path from "path"
import cors from "cors"
import dotenv from "dotenv"
import express, {
    type Request as ExpressRequest,
    type Response as ExpressResponse,
    type NextFunction,
} from "express"

// dotenv.config({ path: path.resolve(__dirname, "../.env") })
dotenv.config()

const IS_PROD = process.env.NODE_ENV === "production"

import { CognitoJwtVerifier } from "aws-jwt-verify"

let verifier: any = null

if (IS_PROD) {
    verifier = CognitoJwtVerifier.create({
        userPoolId: process.env.COGNITO_USER_POOL_ID as string,
        tokenUse: "access",
        clientId: process.env.COGNITO_CLIENT_ID as string,
    })
}

import sequelize from "./src/database"
import "./src/models/associations"
import cteDistrictProgramRouter from "./src/routes/cte_district_program.routes"
import programCatalogRouter from "./src/routes/program_catalog.routes"
import courseInstanceRouter from "./src/routes/course_instance.routes"
import cteDistrictRouter from "./src/routes/cte_district.routes"
import cteSchoolRouter from "./src/routes/cte_school.routes"
import homeSchoolRouter from "./src/routes/home_school.routes"
import courseCatalogRouter from "./src/routes/course_catalog.routes"
import wblCategoriesRouter from "./src/routes/wbl_catagories.routes"
import wblStudentsRouter from "./src/routes/wbl_students.routes"
import studentRouter from "./src/routes/student.routes"
import staffRouter from "./src/routes/staff.routes"
import formRouter from "./src/routes/form.routes"
import studentForm from "./src/routes/student_form.routes"
import fileRouter from "./src/routes/file_upload.routes"

import {
    createRandomStudents,
    createRandomFlags,
    createCourseInstances,
    createEnrollments,
} from "./src/utils/fake_date"
import { create } from "domain"

const app = express()
app.use(
    cors({
        allowedHeaders: ["Content-Type", "Authorization"],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    })
)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

declare global {
    namespace Express {
        interface Request {
            user?: any
        }
    }
}

async function requireAuth(req: ExpressRequest, res: ExpressResponse, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader) return res.status(401).send("No token provided")

        const token = authHeader.split(" ")[1] // Bearer <token>
        const payload = await verifier.verify(token)

        // Attach user info to request for use in route handlers
        req.user = payload
        next() // pass control to the next middleware/route
    } catch (err: any) {
        res.status(401).send("Unauthorized: " + err.message)
    }
}

app.get("/health", (req, res) => {
    res.status(200).send("Health This works....")
})

if (IS_PROD) {
    app.use("/api", requireAuth)
}

//put apis here
app.use("/api/cte-district-programs", cteDistrictProgramRouter)
app.use("/api/program-catalogs", programCatalogRouter)
app.use("/api/course-catalogs", courseCatalogRouter)
app.use("/api/course-instances", courseInstanceRouter)
app.use("/api/cte-districts", cteDistrictRouter)
app.use("/api/cte-schools", cteSchoolRouter)
app.use("/api/home-schools", homeSchoolRouter)
app.use("/api/wbl-categories", wblCategoriesRouter)
app.use("/api/wbl-students", wblStudentsRouter)
app.use("/api/students", studentRouter)
app.use("/api/staff", staffRouter)
app.use("/api/form", formRouter) //probabaly should consolidate
app.use("/api/form", studentForm)
// app.use("/api/file", fileRouter);

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
    // await createRandomStudents(100)
    // await createRandomFlags(50)
    // await createCourseInstances(20)
    // await createEnrollments(200)

    console.log(`Server is running on port ${PORT}`)
})
