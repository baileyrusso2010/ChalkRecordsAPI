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
// dotenv.config();

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
import cteDistrictProgramRouter from "./src/routes/cte_district_program.routes";
import programCatalogRouter from "./src/routes/program_catalog.routes";
import courseInstanceRouter from "./src/routes/course_instance.routes";
import cteDistrictRouter from "./src/routes/cte_district.routes";
import cteSchoolRouter from "./src/routes/cte_school.routes";
import homeSchoolRouter from "./src/routes/home_school.routes";
import courseCatalogRouter from "./src/routes/course_catalog.routes";
import wblCategoriesRouter from "./src/routes/wbl_catagories.routes";
import wblStudentsRouter from "./src/routes/wbl_students.routes";
import studentRouter from "./src/routes/student.routes";
import staffRouter from "./src/routes/staff.routes";
import skillRouter from "./src/routes/skill.routes";
import pdfRouter from "./src/routes/pdf.routes";
import gradingRouter from "./src/routes/gradebook.routes";
import formroutes from "./src/routes/form.routes";
import staticRoutes from "./src/routes/static_field.routes";
import rubricRoutes from "./src/routes/rubric_routes";
import classFormAssignmentRouter from "./src/routes/class_form_assignment.routes";

import { importFromCSV } from "./src/utils/fake_date";
import { fillForm } from "./src/utils/pdf/generate_test";

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

//put apis here
app.use("/api/cte-district-programs", cteDistrictProgramRouter);
app.use("/api/program-catalogs", programCatalogRouter);
app.use("/api/course-catalogs", courseCatalogRouter);
app.use("/api/course-instances", courseInstanceRouter);
app.use("/api/cte-districts", cteDistrictRouter);
app.use("/api/cte-schools", cteSchoolRouter);
app.use("/api/home-schools", homeSchoolRouter);
app.use("/api/wbl-categories", wblCategoriesRouter);
app.use("/api/wbl-students", wblStudentsRouter);
app.use("/api/students", studentRouter);
app.use("/api/staff", staffRouter);
app.use("/api/skill", skillRouter);
app.use("/api/pdf", pdfRouter);
app.use("/api/gradebook", gradingRouter);

//forms
app.use("/api/forms", formroutes);
app.use("/api/static-fields", staticRoutes);
app.use("/api/rubric", rubricRoutes);
app.use("/api/class-form-assignments", classFormAssignmentRouter);

// app.use("/api/file", fileRouter);

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

  // Read and parse CSV file instead of hardcoding
  //   const fs = require("fs");
  //   const parse = require("csv-parse/sync");
  //   const csvFilePath = path.resolve(__dirname, "data.csv"); // Change to your CSV filename
  //   const csvContent = fs.readFileSync(csvFilePath, "utf-8");
  //   const csvRows = parse.parse(csvContent, {
  //     columns: true,
  //     skip_empty_lines: true,
  //   });
  //   await importFromCSV(csvRows);

  console.log(`Server is running on port ${PORT}`);
});
