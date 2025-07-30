import { Request, Response } from "express"
import { CTESchool } from "../models/cte_school.model"
import { SchoolDistricts } from "../models/school_district.model"
import { Student } from "../models/student.model"
import sequelize from "../database"
import { Class } from "../models/classes.model"
import { Staff } from "../models/staff.model"

export const getAllCTESchools = async (req: Request, res: Response) => {
    try {
        const cteSchools = await CTESchool.findAll({})

        res.status(200).json({ cteSchools })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to get CTE schools" })
    }
}

export const getCTESchoolSummary = async (req: Request, res: Response) => {
    const cteSchoolId = req.params.id

    try {
        const cteSchool = await CTESchool.findByPk(cteSchoolId, {
            include: [
                {
                    model: Class,
                    attributes: ["id", "name"],
                    include: [
                        {
                            model: Staff,
                            attributes: ["id", "email"], // adjust attributes as needed
                        },
                    ],
                },
            ],
        })

        res.status(200).json({ cteSchool })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to get class flag count" })
    }
}
