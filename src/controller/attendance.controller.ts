import { Request, Response } from "express"
import { Attendance } from "../models/attendance.model"

const parseId = (raw: any) => {
    const n = Number(raw)
    return Number.isInteger(n) && n > 0 ? n : null
}

const validateAttendancePayload = (
    body: any,
    { partial = false }: { partial?: boolean } = {}
): { data?: any; errors?: string[] } => {
    if (!body || typeof body !== "object") return { errors: ["Request body is missing or invalid"] }
    const allowed = ["studentId", "courseId", "attenanceTypeId", "date", "notes"]
    const unknown = Object.keys(body).filter((k) => !allowed.includes(k))
    if (unknown.length) return { errors: ["Unknown fields: " + unknown.join(", ")] }

    const errors: string[] = []
    const data: any = {}

    const must = (field: string) => !partial && body[field] === undefined
    if (must("studentId")) errors.push("studentId is required")
    if (must("courseId")) errors.push("courseId is required")
    if (must("attenanceTypeId")) errors.push("attenanceTypeId is required")
    if (must("date")) errors.push("date is required")

    const intField = (name: string) => {
        if (body[name] !== undefined) {
            const v = Number(body[name])
            if (!Number.isInteger(v) || v <= 0) errors.push(`${name} must be a positive integer`)
            else data[name] = v
        }
    }
    intField("studentId")
    intField("courseId")
    intField("attenanceTypeId")

    if (body.date !== undefined) {
        const d = new Date(body.date)
        if (isNaN(d.getTime())) errors.push("date must be a valid date")
        else data.date = d
    }
    if (body.notes !== undefined) {
        if (body.notes !== null && typeof body.notes !== "string")
            errors.push("notes must be a string or null")
        else data.notes = body.notes
    }

    if (errors.length) return { errors }
    return { data }
}

export const createAttendance = async (req: Request, res: Response) => {
    try {
        const { data, errors } = validateAttendancePayload(req.body)
        if (errors) return res.status(400).json({ errors })
        const created = await Attendance.create(data)
        return res.status(201).json(created)
    } catch (err) {
        console.error("createAttendance error", err)
        return res.status(500).json({ error: "Internal server error" })
    }
}

export const getAttendance = async (req: Request, res: Response) => {
    try {
        const id = parseId(req.params.id)
        if (!id) return res.status(400).json({ error: "Invalid id parameter" })
        const record = await Attendance.findByPk(id)
        if (!record) return res.status(404).json({ error: "Attendance not found" })
        return res.status(200).json(record)
    } catch (err) {
        console.error("getAttendance error", err)
        return res.status(500).json({ error: "Internal server error" })
    }
}

export const updateAttendance = async (req: Request, res: Response) => {
    try {
        const id = parseId(req.params.id)
        if (!id) return res.status(400).json({ error: "Invalid id parameter" })
        const { data, errors } = validateAttendancePayload(req.body, { partial: true })
        if (errors) return res.status(400).json({ errors })
        if (!Object.keys(data).length)
            return res.status(400).json({ error: "No valid fields provided to update" })
        const [affected] = await Attendance.update(data, { where: { id } })
        if (!affected) return res.status(404).json({ error: "Attendance not found" })
        const updated = await Attendance.findByPk(id)
        return res.status(200).json(updated)
    } catch (err) {
        console.error("updateAttendance error", err)
        return res.status(500).json({ error: "Internal server error" })
    }
}

export const deleteAttendance = async (req: Request, res: Response) => {
    try {
        const id = parseId(req.params.id)
        if (!id) return res.status(400).json({ error: "Invalid id parameter" })
        const deleted = await Attendance.destroy({ where: { id } })
        if (!deleted) return res.status(404).json({ error: "Attendance not found" })
        return res.status(200).json({ deleted: true, id })
    } catch (err) {
        console.error("deleteAttendance error", err)
        return res.status(500).json({ error: "Internal server error" })
    }
}

export const listAttendance = async (req: Request, res: Response) => {
    try {
        const where: any = {}
        if (req.query.studentId) {
            const v = parseId(req.query.studentId)
            if (!v) return res.status(400).json({ error: "Invalid studentId query param" })
            where.studentId = v
        }
        if (req.query.courseId) {
            const v = parseId(req.query.courseId)
            if (!v) return res.status(400).json({ error: "Invalid courseId query param" })
            where.courseId = v
        }
        const records = await Attendance.findAll({ where })
        return res.status(200).json(records)
    } catch (err) {
        console.error("listAttendance error", err)
        return res.status(500).json({ error: "Internal server error" })
    }
}
