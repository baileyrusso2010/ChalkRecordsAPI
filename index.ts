const PORT = process.env.PORT || 3000;
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

import sequelize from "./src/database";
import "./src/models/associations";
import studentRoutes from "./src/routes/student.routes";
import classRoutes from "./src/routes/class.routes";
import {
  generateClassData,
  generateCTESchoolData,
  generateProgramData,
  generateSchoolDistrictData,
  generateStaffData,
  generateStudentData,
} from "./src/data/fake_data";

app.listen(PORT, async () => {
  await sequelize
    .authenticate()
    .then(async () => {
      console.log("Database connection has been established successfully.");
    })
    .catch((error: any) => {
      console.error("Unable to connect to the database:", error);
    });

  await sequelize.sync({ force: true }); // Use force: true only in development to drop and recreate tables
  await generateCTESchoolData();
  await generateSchoolDistrictData();
  await generateProgramData();
  await generateStaffData();
  await generateClassData();
  await generateStudentData();

  console.log(`Server is running on port ${PORT}`);
});

app.use("/api", studentRoutes);
app.use("/api", classRoutes);
