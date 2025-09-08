import { Router } from "express";
import {
  getAllCourseCatalogs,
  insertCourse,
  getAllCourses,
  getCourse,
  insertCourseSubCourse,
  insertSubCourse,
  getAllSubCourses,
  getSubCoursesPerClass,
} from "../controller/course.controller";

const router = Router();

// Course catalogs (reference data)
router.get("/course-catalogs", getAllCourseCatalogs);

// Courses collection
router.get("/courses", getAllCourses);
// Single course
router.get("/courses/:id", getCourse);
// Create course
router.post("/courses", insertCourse);

router.post("/course-sub-courses", insertCourseSubCourse);

router.get("/classes/:id/sub-courses", getSubCoursesPerClass);

router.get("/sub-courses", getAllSubCourses);
// Create sub course
router.post("/sub-courses", insertSubCourse);

export default router;
