import { Request, Response } from "express";
import { Op } from "sequelize";
import { Class } from "../models/classes.model";
import { Program } from "../models/program.model";
import { Staff } from "../models/staff.model";

export const getAllClasses = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const classes = await Class.findAll({
      include: [
        {
          model: Program,
          attributes: ["name"],
        },
        {
          model: Staff, // Assuming Staff model is defined and associated
          attributes: ["name", "email"],
        },
      ],
      attributes: ["id"],
    });

    res.status(200).json(classes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to obtain classes" });
  }
};
