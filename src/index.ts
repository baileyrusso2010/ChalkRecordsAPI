const PORT = process.env.PORT || 3000
import * as bodyParser from "body-parser"
import cors from "cors"
import dotenv from "dotenv"
import express, {
    type Request as ExpressRequest,
    type Response as ExpressResponse,
    type NextFunction,
} from "express"

// dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config()

import { routes } from "./routes"
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

import sequelize from "./database"
import "./models/associations"

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

routes.forEach(({ path, router }: { path: string; router: any }) => {
    app.use(path, router)
})

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

    console.log(`Server is running on port ${PORT}`)
})
