import { Request, Response } from "express"
import { Roles } from "../../models/users/roles.model"
import { Permissions } from "../../models/users/permissions.model"
import { RolePermissions } from "../../models/users/role_permissions.model"

export async function createRole(req: Request, res: Response) {
    try {
        const { name } = req.body
        const role = await Roles.create({ name })
        res.status(201).json(role)
    } catch (err: any) {
        console.error("Error creating role:", err)
        res.status(500).json({ error: "Failed to create role" })
    }
}

export async function getAllRoles(req: Request, res: Response) {
    try {
        const roles = await Roles.findAll({
            include: [
                {
                    model: Permissions,
                    as: "permissions",
                    through: { attributes: [] }, // Hide join table attributes
                },
            ],
        })
        res.status(200).json(roles)
    } catch (err: any) {
        console.error("Error getting roles:", err)
        res.status(500).json({ error: "Failed to get roles" })
    }
}

export async function getRoleById(req: Request, res: Response) {
    try {
        const { id } = req.params
        const role = await Roles.findByPk(id, {
            include: [
                {
                    model: Permissions,
                    as: "permissions",
                    through: { attributes: [] },
                },
            ],
        })
        if (!role) {
            return res.status(404).json({ error: "Role not found" })
        }
        res.status(200).json(role)
    } catch (err: any) {
        console.error("Error getting role:", err)
        res.status(500).json({ error: "Failed to get role" })
    }
}

export async function updateRole(req: Request, res: Response) {
    try {
        const { id } = req.params
        const { name } = req.body
        const role = await Roles.findByPk(id)
        if (!role) {
            return res.status(404).json({ error: "Role not found" })
        }
        await role.update({ name })
        res.status(200).json(role)
    } catch (err: any) {
        console.error("Error updating role:", err)
        res.status(500).json({ error: "Failed to update role" })
    }
}

export async function deleteRole(req: Request, res: Response) {
    try {
        const { id } = req.params
        const role = await Roles.findByPk(id)
        if (!role) {
            return res.status(404).json({ error: "Role not found" })
        }
        await role.destroy()
        res.status(204).send()
    } catch (err: any) {
        console.error("Error deleting role:", err)
        res.status(500).json({ error: "Failed to delete role" })
    }
}

export async function addPermissionToRole(req: Request, res: Response) {
    try {
        const { roleId, permissionId } = req.body

        // Check if role and permission exist
        const role = await Roles.findByPk(roleId)
        if (!role) return res.status(404).json({ error: "Role not found" })

        const permission = await Permissions.findByPk(permissionId)
        if (!permission) return res.status(404).json({ error: "Permission not found" })

        await RolePermissions.create({
            role_id: roleId,
            permission_id: permissionId,
        })

        res.status(201).json({ message: "Permission added to role" })
    } catch (err: any) {
        // Check for unique constraint violation
        if (err.name === "SequelizeUniqueConstraintError") {
            return res.status(400).json({ error: "Permission already assigned to role" })
        }
        console.error("Error adding permission to role:", err)
        res.status(500).json({ error: "Failed to add permission to role" })
    }
}

export async function removePermissionFromRole(req: Request, res: Response) {
    try {
        const { roleId, permissionId } = req.params

        const deleted = await RolePermissions.destroy({
            where: {
                role_id: roleId,
                permission_id: permissionId,
            },
        })

        if (deleted === 0) {
            return res.status(404).json({ error: "Association not found" })
        }

        res.status(200).json({ message: "Permission removed from role" })
    } catch (err: any) {
        console.error("Error removing permission from role:", err)
        res.status(500).json({ error: "Failed to remove permission from role" })
    }
}
