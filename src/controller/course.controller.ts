import { Request, Response } from "express";
import { Op } from "sequelize";
import { CourseCatalog } from "../models/course_catalog.model";
import { Course } from "../models/course.model";
import { Program } from "../models/program.model";
import { ProgramCatalog } from "../models/program_catalog.model";
import { Users } from "../models/users.model";
import { SubCourse } from "../models/sub_course.model";
import { CourseSubCourse } from "../models/course_subcourse.model";

export const getAllCourseCatalogs = async (req: Request, res: Response) => {
  try {
    const results = await CourseCatalog.findAll({});

    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Internal server error" });
  }
};
export const insertCourse = async (req: Request, res: Response) => {
  try {
    const item = req.body;

    const required = [
      "program_id",
      "catalog_id",
      "alias",
      "teacher_id",
      // "school_id",
      // "credits",
    ];
    const missing = required.find(
      (f) => item[f] === undefined || item[f] === null
    );
    if (missing) {
      return res
        .status(400)
        .json({ error: `Missing required field: ${missing}` });
    }

    const row = await Course.create(item);
    res.status(201).json(row);
  } catch (e: any) {
    console.error(e);
    if (e.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: "Validation failed",
        details: e.errors.map((x: any) => ({
          field: x.path,
          message: x.message,
        })),
      });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCourse = async (req: Request, res: Response) => {
  const courseId = req.params.id;

  try {
    if (!courseId) {
      res.status(400).send({ error: "Course ID is required" });
      return;
    }

    const results = await Course.findByPk(courseId, {
      include: [
        {
          model: CourseCatalog,
          as: "course_catalog",
          attributes: ["course_code", "course_name", "course_description"],
        },
        {
          model: Users,
          as: "users",
        },
        {
          model: Program,
          as: "program",
          attributes: ["id"],
          include: [
            {
              model: ProgramCatalog,
              as: "program_catalog",
              attributes: ["code", "name"],
            },
          ],
        },
      ],
    });

    res.status(200).send(results);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Internal server error" });
  }
};

export const getAllCourses = async (req: Request, res: Response) => {
  try {
    const results = await Course.findAll({
      include: [
        {
          model: CourseCatalog,
          as: "course_catalog",
          attributes: ["course_code", "course_name", "course_description"],
        },
        {
          model: Users,
          as: "users",
        },
        {
          model: Program,
          as: "program",
          attributes: ["id"],
          include: [
            {
              model: ProgramCatalog,
              as: "program_catalog",
              attributes: ["code", "name"],
            },
          ],
        },
      ],
      attributes: ["id", "alias", "school_year"],
      order: [["id", "DESC"]],
    });

    res.status(200).json({ courses: results });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Internal server error" });
  }
};

//sub courses

export const getAllSubCourses = async (req: Request, res: Response) => {
  try {
    //have to do it by school district
    const results = await SubCourse.findAll({
      include: [
        {
          model: CourseCatalog,
          as: "course_catalog",
          attributes: ["course_code", "course_name", "course_description"],
        },
        {
          model: Users,
          as: "users",
        },
      ],
      attributes: ["id", "name", "catalog_id", "teacher_id"],
      order: [["id", "DESC"]],
    });

    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Internal server error" });
  }
};

export const insertSubCourse = async (req: Request, res: Response) => {
  try {
    const item = req.body;

    const required = ["name", "catalog_id", "teacher_id"];
    const missing = required.find(
      (f) => item[f] === undefined || item[f] === null
    );
    if (missing) {
      return res
        .status(400)
        .json({ error: `Missing required field: ${missing}` });
    }

    const row = await SubCourse.create(item);
    res.status(201).json(row);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Internal server error" });
  }
};

export const insertCourseSubCourse = async (req: Request, res: Response) => {
  try {
    const item = req.body;

    const required = ["course_id", "sub_course_id"];
    const missing = required.find(
      (f) => item[f] === undefined || item[f] === null
    );
    if (missing) {
      return res
        .status(400)
        .json({ error: `Missing required field: ${missing}` });
    }

    const row = await CourseSubCourse.create(item);
    res.status(201).json(row);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Internal server error" });
  }
};
