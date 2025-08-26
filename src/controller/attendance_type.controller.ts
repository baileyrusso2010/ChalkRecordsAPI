import { Request, Response } from "express"
import { AttendanceType } from "../models/attendance_type.mode"

const parseId = (raw: any) => {
    const n = Number(raw)
    return Number.isInteger(n) && n > 0 ? n : null
}

const validateTypePayload = (
    body: any,
    { partial = false }: { partial?: boolean } = {}
): { data?: any; errors?: string[] } => {
    if (!body || typeof body !== "object") return { errors: ["Request body is missing or invalid"] }
    const allowed = ["code", "description"]
    const unknown = Object.keys(body).filter((k) => !allowed.includes(k))
    if (unknown.length) return { errors: ["Unknown fields: " + unknown.join(", ")] }
    const errors: string[] = []
    const data: any = {}

    if (!partial || body.code !== undefined) {
        if (typeof body.code !== "string" || !body.code.trim())
            errors.push("code must be a non-empty string")
        else if (body.code.length > 20) errors.push("code must be <= 20 characters")
        else data.code = body.code.trim()
    }
    if (!partial || body.description !== undefined) {
        if (typeof body.description !== "string" || !body.description.trim())
            errors.push("description must be a non-empty string")
        else if (body.description.length > 50) errors.push("description must be <= 50 characters")
        else data.description = body.description.trim()
    }

    if (!partial) {
        ;["code", "description"].forEach((f) => {
            if (body[f] === undefined) errors.push(`${f} is required`)
        })
    }

    if (errors.length) return { errors }
    return { data }
}

export const createAttendanceType = async (req: Request, res: Response) => {
    try {
        const { data, errors } = validateTypePayload(req.body)
        if (errors) return res.status(400).json({ errors })
        const created = await AttendanceType.create(data)
        return res.status(201).json(created)
    } catch (err) {
        console.error("createAttendanceType error", err)
        return res.status(500).json({ error: "Internal server error" })
    }
}

export const getAttendanceType = async (req: Request, res: Response) => {
    try {
        const id = parseId(req.params.id)
        if (!id) return res.status(400).json({ error: "Invalid id parameter" })
        const record = await AttendanceType.findByPk(id)
        if (!record) return res.status(404).json({ error: "Attendance type not found" })
        return res.status(200).json(record)
    } catch (err) {
        console.error("getAttendanceType error", err)
        return res.status(500).json({ error: "Internal server error" })
    }
}

export const listAttendanceTypes = async (_req: Request, res: Response) => {
    try {
        const records = await AttendanceType.findAll()
        return res.status(200).json(records)
    } catch (err) {
        console.error("listAttendanceTypes error", err)
        return res.status(500).json({ error: "Internal server error" })
    }
}

export const updateAttendanceType = async (req: Request, res: Response) => {
    try {
        const id = parseId(req.params.id)
        if (!id) return res.status(400).json({ error: "Invalid id parameter" })
        const { data, errors } = validateTypePayload(req.body, { partial: true })
        if (errors) return res.status(400).json({ errors })
        if (!Object.keys(data).length)
            return res.status(400).json({ error: "No valid fields provided to update" })
        const [affected] = await AttendanceType.update(data, { where: { id } })
        if (!affected) return res.status(404).json({ error: "Attendance type not found" })
        const updated = await AttendanceType.findByPk(id)
        return res.status(200).json(updated)
    } catch (err) {
        console.error("updateAttendanceType error", err)
        return res.status(500).json({ error: "Internal server error" })
    }
}

export const deleteAttendanceType = async (req: Request, res: Response) => {
    try {
        const id = parseId(req.params.id)
        if (!id) return res.status(400).json({ error: "Invalid id parameter" })
        const deleted = await AttendanceType.destroy({ where: { id } })
        if (!deleted) return res.status(404).json({ error: "Attendance type not found" })
        return res.status(200).json({ deleted: true, id })
    } catch (err) {
        console.error("deleteAttendanceType error", err)
        return res.status(500).json({ error: "Internal server error" })
    }
}
