import { Router } from "express";
import {
  getCTESchoolDistrict,
  getSchoolsInDistrict,
  getHomeSchools,
} from "../controller/school.controller";

const router = Router();

router.get("/cte-school-district/:id", getCTESchoolDistrict);
router.get("/schools-in-district/:id", getSchoolsInDistrict);
router.get("/home-schools/:cteSchoolId", getHomeSchools);

export default router;
