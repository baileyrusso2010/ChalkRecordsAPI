import { Request, Response } from "express"
import { District_Program } from "../../models/program/district_program.model"
import { Course_Instance } from "../../models/course/course_instance.model"
import { Staff } from "../../models/users/staff.model"
import { Roles } from "../../models/users/roles.model"
import { Staff_Roles } from "../../models/users/staff_roles.model"
import { Permissions } from "../../models/users/permissions.model"
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
                            model: District_Program,
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

export async function getAllStaff(req: Request, res: Response) {
    try {
        const staff = await Staff.findAll({
            include: [
                {
                    model: Roles,
                    as: "roles",
                    include: [
                        {
                            model: Permissions,
                            as: "permissions",
                            through: { attributes: [] },
                        },
                    ],
                    through: { attributes: [] },
                },
            ],
            order: [
                ["last_name", "ASC"],
                ["first_name", "ASC"],
            ],
        })
        res.status(200).json(staff)
    } catch (err: any) {
        console.error("Error getting all staff:", err)
        res.status(500).json({ error: "Failed to get all staff" })
    }
}

export async function assignRoleToStaff(req: Request, res: Response) {
    try {
        const { staffId } = req.params
        const { roleId, scope_type = "system", scope_id = null } = req.body

        const staff = await Staff.findByPk(staffId)
        if (!staff) return res.status(404).json({ error: "Staff not found" })

        const role = await Roles.findByPk(roleId)
        if (!role) return res.status(404).json({ error: "Role not found" })

        await Staff_Roles.create({
            staff_id: Number(staffId),
            role_id: Number(roleId),
            scope_type,
            scope_id,
        })

        res.status(201).json({ message: "Role assigned to staff" })
    } catch (err: any) {
        if (err.name === "SequelizeUniqueConstraintError") {
            return res.status(400).json({ error: "Role already assigned to staff" })
        }
        console.error("Error assigning role to staff:", err)
        res.status(500).json({ error: "Failed to assign role to staff" })
    }
}

export async function removeRoleFromStaff(req: Request, res: Response) {
    try {
        const { staffId, roleId } = req.params

        const deleted = await Staff_Roles.destroy({
            where: {
                staff_id: staffId,
                role_id: roleId,
            },
        })

        if (deleted === 0) {
            return res.status(404).json({ error: "Role assignment not found" })
        }

        res.status(200).json({ message: "Role removed from staff" })
    } catch (err: any) {
        console.error("Error removing role from staff:", err)
        res.status(500).json({ error: "Failed to remove role from staff" })
    }
}
