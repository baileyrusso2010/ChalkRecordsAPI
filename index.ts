const PORT = process.env.PORT || 3000;
import * as bodyParser from "body-parser";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import express, {
  type Request as ExpressRequest,
  type Response as ExpressResponse,
  type NextFunction,
} from "express";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const IS_PROD = process.env.NODE_ENV === "production";

import { CognitoJwtVerifier } from "aws-jwt-verify";

let verifier: any = null;

if (IS_PROD) {
  verifier = CognitoJwtVerifier.create({
    userPoolId: process.env.COGNITO_USER_POOL_ID as string,
    tokenUse: "access",
    clientId: process.env.COGNITO_CLIENT_ID as string,
  });
}

import sequelize from "./src/database";
import "./src/models/associations";
import generateFakeData from "./src/data/fake_data";

import courseRoutes from "./src/routes/course.routes";
import programRoutes from "./src/routes/program.routes";
import userRoutes from "./src/routes/user.routes";
import studentRoutes from "./src/routes/student.routes";
import wblRoutes from "./src/routes/wbl.routes";
import assignmentRoutes from "./src/routes/assignment.routes";
import gradeRoutes from "./src/routes/grade.routes";
import attendanceRoutes from "./src/routes/attendance.routes";
import attendanceTypeRoutes from "./src/routes/attendance_type.routes";
import flagRoutes from "./src/routes/flag.routes";
import uploadRoutes from "./src/routes/file_upload.routes";
import schoolRoutes from "./src/routes/school.routes";

const app = express();
app.use(
  cors({
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

async function requireAuth(
  req: ExpressRequest,
  res: ExpressResponse,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).send("No token provided");

    const token = authHeader.split(" ")[1]; // Bearer <token>
    const payload = await verifier.verify(token);

    // Attach user info to request for use in route handlers
    req.user = payload;
    next(); // pass control to the next middleware/route
  } catch (err: any) {
    res.status(401).send("Unauthorized: " + err.message);
  }
}

app.get("/health", (req, res) => {
  res.status(200).send("Health This works....");
});

if (IS_PROD) {
  app.use("/api", requireAuth);
}

// Unified API prefix; each router defines its own resource paths (e.g. /courses, /programs, /teachers, /classes/:id/students, /enrollments)
app.use("/api", courseRoutes);
app.use("/api", programRoutes);
app.use("/api", userRoutes);
app.use("/api", studentRoutes);
app.use("/api", wblRoutes);
app.use("/api", assignmentRoutes);
app.use("/api", gradeRoutes);
app.use("/api", attendanceRoutes);
app.use("/api", attendanceTypeRoutes);
app.use("/api", flagRoutes);
app.use("/api", uploadRoutes);
app.use("/api", schoolRoutes);

app.listen(PORT, async () => {
  await sequelize
    .authenticate()
    .then(async () => {
      console.log("Database connection has been established successfully.");
    })
    .catch((error: any) => {
      console.error("Unable to connect to the database:", error);
    });

  await sequelize.sync({ alter: true }); // Use force: true only in development to drop and recreate tables
  //   await generateFakeData();

  console.log(`Server is running on port ${PORT}`);
});
