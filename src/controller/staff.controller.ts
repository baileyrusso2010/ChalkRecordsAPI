import { Request, Response } from "express"
import { CTE_District_Program } from "../models/program/cte_district_program.model"
import { Course_Instance } from "../models/course/course_instance.model"
import { Staff } from "../models/staff.model"
import { Op, fn, col } from "sequelize"

export async function getTeachersByProgram(req: Request, res: Response) {
    try {
        const id = req.params.id //cte-district-program

        if (!id) return res.status(400).json({ error: "Invalid id" })

        //could cause problems since

        const data = await Staff.findAll({
            attributes: [
                "id",
                [fn("max", col("first_name")), "first_name"],
                [fn("max", col("last_name")), "last_name"],
            ],
            include: [
                {
                    model: Course_Instance,
                    as: "instructed_courses", //this alias stuff needs to be fix
                    attributes: [],
                    required: true,
                    include: [
                        {
                            model: CTE_District_Program,
                            as: "district_program",
                            attributes: [],
                            where: { id },
                            required: true,
                        },
                    ],
                },
            ],
            group: ["Staff.id"],
        })

        res.status(200).send(data)
    } catch (err) {
        console.error("Error getting district program teachers", err)
        res.status(500).json({ error: "Fialed to get teachers by program" })
    }
}
