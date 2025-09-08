import { Request, Response } from "express";
import { Op, fn, col, where } from "sequelize";
import { District } from "../models/district.model";
import { School } from "../models/school.model";
import { HomeSchool } from "../models/home_school.model";

export const getCTESchoolDistrict = async (req: Request, res: Response) => {
  try {
    const district = await District.findByPk(req.params.id);
    if (!district) {
      return res.status(404).send({ error: "District not found" });
    }

    res.send(district);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Internal server error" });
  }
};

export const getSchoolsInDistrict = async (req: Request, res: Response) => {
  try {
    const districtId = req.params.id;
    const schools = await School.findAll({
      where: { district_id: districtId },
      attributes: ["id", "name"],
    });

    res.send(schools);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Internal server error" });
  }
};

export const getHomeSchools = async (req: Request, res: Response) => {
  try {
    const homeSchools = await HomeSchool.findAll({
      where: {
        cte_school_id: req.params.cteSchoolId,
      },
    });

    if (!homeSchools) {
      return res
        .status(404)
        .send({ error: "No home schools found for this CTE school" });
    }

    res.send(homeSchools);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Internal server error" });
  }
};
