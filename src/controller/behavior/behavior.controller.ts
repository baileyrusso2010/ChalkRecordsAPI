import { Request, Response } from "express";
import { Op } from "sequelize";
import sequelize from "../../database";
import { Behavior } from "../../models/behavior/behavior.model";
import { BehaviorType } from "../../models/behavior/behavior_type.model";
import { Student } from "../../models/student.model";
import { Staff } from "../../models/staff.model";

export const getAllBehaviors = async (req: Request, res: Response) => {
  try {
    const behaviors = await Behavior.findAll({
      include: [
        { model: BehaviorType, as: "behavior_type" },
        {
          model: Student,
          as: "student",
          attributes: ["id", "first_name", "last_name"],
        },
        {
          model: Staff,
          as: "staff",
          attributes: ["id", "first_name", "last_name"],
        },
      ],
    });
    res.status(200).json(behaviors);
  } catch (error) {
    console.error("Error fetching behaviors:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getBehaviorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const behavior = await Behavior.findByPk(id, {
      include: [
        { model: BehaviorType, as: "behavior_type" },
        {
          model: Student,
          as: "student",
          attributes: ["id", "first_name", "last_name"],
        },
        {
          model: Staff,
          as: "staff",
          attributes: ["id", "first_name", "last_name"],
        },
      ],
    });

    if (!behavior) {
      return res.status(404).json({ error: "Behavior record not found" });
    }

    res.status(200).json(behavior);
  } catch (error) {
    console.error("Error fetching behavior:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getBehaviorsByStudentId = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const behaviors = await Behavior.findAll({
      where: { student_id: studentId },
      include: [
        { model: BehaviorType, as: "behavior_type" },
        {
          model: Staff,
          as: "staff",
          attributes: ["id", "first_name", "last_name"],
        },
      ],
    });
    res.status(200).json(behaviors);
  } catch (error) {
    console.error("Error fetching student behaviors:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getBehaviorAnalytics = async (req: Request, res: Response) => {
  try {
    const { groupBy, startDate, endDate, studentId } = req.query;

    const whereClause: any = {};

    // 1. Add Filters
    if (studentId) whereClause.student_id = studentId;
    if (startDate && endDate) {
      whereClause.date = {
        [Op.between]: [
          new Date(startDate as string),
          new Date(endDate as string),
        ],
      };
    }

    let groupAttribute: any;
    let include: any[] = [];
    let groupColumn: string[] = [];

    // 2. Determine Grouping Logic
    switch (groupBy) {
      case "month":
        // Postgres specific: truncate date to month
        groupAttribute = [
          sequelize.fn("DATE_TRUNC", "month", sequelize.col("date")),
          "time_period",
        ];
        groupColumn = ["time_period"];
        break;
      case "week":
        groupAttribute = [
          sequelize.fn("DATE_TRUNC", "week", sequelize.col("date")),
          "time_period",
        ];
        groupColumn = ["time_period"];
        break;
      case "year":
        groupAttribute = [
          sequelize.fn("DATE_TRUNC", "year", sequelize.col("date")),
          "time_period",
        ];
        groupColumn = ["time_period"];
        break;
      case "student":
        groupAttribute = "student.id";
        include = [
          {
            model: Student,
            as: "student",
            attributes: ["first_name", "last_name"],
          },
        ];
        // Must group by all selected columns from the included model if counting?
        // Actually, for functional dependency, student.id is enough.
        // But to be safe in SQL generally:
        groupColumn = [
          "Behavior.student_id",
          "student.id",
          "student.first_name",
          "student.last_name",
        ];
        break;
      case "type":
        groupAttribute = "behavior_type.name";
        include = [
          { model: BehaviorType, as: "behavior_type", attributes: ["name"] },
        ];
        // Assuming strict group by
        groupColumn = [
          "Behavior.behavior_type_id",
          "behavior_type.id",
          "behavior_type.name",
        ];
        break;
      default:
        // Default to simple count
        return res
          .status(400)
          .json({ error: "Invalid or missing groupBy parameter" });
    }

    const attributes: any[] = [
      [sequelize.fn("COUNT", sequelize.col("Behavior.id")), "count"],
    ];

    if (Array.isArray(groupAttribute)) {
      attributes.push(groupAttribute);
    }

    // 3. Execute Query
    const data = await Behavior.findAll({
      where: whereClause,
      attributes: attributes,
      include: include,
      group: groupColumn,
      order: [[sequelize.literal("count"), "DESC"]],
      raw: true, // often easier for charting libraries
      nest: true,
    });

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
