import { Request, Response } from "express"
import { Permissions } from "../../models/users/permissions.model"

export async function createPermission(req: Request, res: Response) {
    try {
        const { key, description } = req.body
        const permission = await Permissions.create({ key, description })
        res.status(201).json(permission)
    } catch (err: any) {
        console.error("Error creating permission:", err)
        res.status(500).json({ error: "Failed to create permission" })
    }
}

export async function getAllPermissions(req: Request, res: Response) {
    try {
        const permissions = await Permissions.findAll()
        res.status(200).json(permissions)
    } catch (err: any) {
        console.error("Error getting permissions:", err)
        res.status(500).json({ error: "Failed to get permissions" })
    }
}

export async function getPermissionById(req: Request, res: Response) {
    try {
        const { id } = req.params
        const permission = await Permissions.findByPk(id)
        if (!permission) {
            return res.status(404).json({ error: "Permission not found" })
        }
        res.status(200).json(permission)
    } catch (err: any) {
        console.error("Error getting permission:", err)
        res.status(500).json({ error: "Failed to get permission" })
    }
}

export async function updatePermission(req: Request, res: Response) {
    try {
        const { id } = req.params
        const { key, description } = req.body
        const permission = await Permissions.findByPk(id)
        if (!permission) {
            return res.status(404).json({ error: "Permission not found" })
        }
        await permission.update({ key, description })
        res.status(200).json(permission)
    } catch (err: any) {
        console.error("Error updating permission:", err)
        res.status(500).json({ error: "Failed to update permission" })
    }
}

export async function deletePermission(req: Request, res: Response) {
    try {
        const { id } = req.params
        const permission = await Permissions.findByPk(id)
        if (!permission) {
            return res.status(404).json({ error: "Permission not found" })
        }
        await permission.destroy()
        res.status(204).send()
    } catch (err: any) {
        console.error("Error deleting permission:", err)
        res.status(500).json({ error: "Failed to delete permission" })
    }
}
