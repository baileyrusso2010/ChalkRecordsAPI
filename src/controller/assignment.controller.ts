import { Request, Response } from "express"
import { Assignment } from "../models/assignment.model"

// Parse & validate a positive integer id
const parseId = (raw: string) => {
    const id = Number(raw)
    return Number.isInteger(id) && id > 0 ? id : null
}

// Validate payload for insert/update. For update we allow partial, but still validate provided fields.
const validatePayload = (
    body: any,
    { partial = false }: { partial?: boolean } = {}
): { data?: any; errors?: string[] } => {
    if (!body || typeof body !== "object") {
        return { errors: ["Request body is missing or invalid"] }
    }

    const allowed = ["courseId", "name", "max_score", "weight", "due_date"]
    const unknownKeys = Object.keys(body).filter((k) => !allowed.includes(k))
    if (unknownKeys.length) {
        return { errors: ["Unknown fields: " + unknownKeys.join(", ")] }
    }

    const errors: string[] = []
    const data: any = {}

    const requireIf = (cond: boolean, field: string, msg: string) => {
        if (cond) errors.push(`${field}: ${msg}`)
    }

    if (!partial || body.courseId !== undefined) {
        const v = Number(body.courseId)
        if (!Number.isInteger(v) || v <= 0) errors.push("courseId must be a positive integer")
        else data.courseId = v
    }
    if (!partial || body.name !== undefined) {
        if (typeof body.name !== "string" || !body.name.trim())
            errors.push("name must be a non-empty string")
        else data.name = body.name.trim()
    }
    if (!partial || body.max_score !== undefined) {
        const v = Number(body.max_score)
        if (!Number.isInteger(v) || v <= 0) errors.push("max_score must be a positive integer")
        else data.max_score = v
    }
    if (body.weight !== undefined) {
        const v = Number(body.weight)
        if (!Number.isFinite(v) || v <= 0) errors.push("weight must be a positive number")
        else data.weight = v
    }
    if (body.due_date !== undefined && body.due_date !== null) {
        const d = new Date(body.due_date)
        if (isNaN(d.getTime())) errors.push("due_date must be a valid date")
        else data.due_date = d
    }

    if (!partial) {
        // Ensure required fields present
        ;["courseId", "name", "max_score"].forEach((f) => {
            if (body[f] === undefined) errors.push(`${f} is required`)
        })
    }

    if (errors.length) return { errors }
    return { data }
}

export const insertAssingment = async (req: Request, res: Response) => {
    try {
        // console.log(req.body)
        // const { data, errors } = validatePayload(req.body, { partial: false })
        // if (errors) return res.status(400).json({ errors })

        if (!req.body) return res.status(400).json({ error: "Request body is missing" })

        const { course_id, due_date, weight, max_score, name } = req.body
        console.log(req.body)

        const created = await Assignment.create({
            courseId: course_id,
            due_date: due_date,
            weight: weight,
            max_score: max_score,
            name: name,
        })
        return res.status(201).json(created)
    } catch (err) {
        console.error("insertAssignment error", err)
        return res.status(500).json({ error: "Internal server error" })
    }
}

export const getAssignment = async (req: Request, res: Response) => {
    try {
        const id = parseId(req.params.id)
        if (!id) return res.status(400).json({ error: "Invalid id parameter" })
        const assignment = await Assignment.findByPk(id)
        if (!assignment) return res.status(404).json({ error: "Assignment not found" })
        return res.status(200).json(assignment)
    } catch (err) {
        console.error("getAssignment error", err)
        return res.status(500).json({ error: "Internal server error" })
    }
}

export const updateAssignment = async (req: Request, res: Response) => {
    try {
        const id = parseId(req.params.id)
        if (!id) return res.status(400).json({ error: "Invalid id parameter" })
        const { data, errors } = validatePayload(req.body, { partial: true })
        if (errors) return res.status(400).json({ errors })
        if (!Object.keys(data).length)
            return res.status(400).json({ error: "No valid fields provided to update" })
        const [affected] = await Assignment.update(data, { where: { id } })
        if (!affected) return res.status(404).json({ error: "Assignment not found" })
        const updated = await Assignment.findByPk(id)
        return res.status(200).json(updated)
    } catch (err) {
        console.error("updateAssignment error", err)
        return res.status(500).json({ error: "Internal server error" })
    }
}

export const deleteAssignment = async (req: Request, res: Response) => {
    try {
        const id = parseId(req.params.id)
        if (!id) return res.status(400).json({ error: "Invalid id parameter" })
        const deleted = await Assignment.destroy({ where: { id } })
        if (!deleted) return res.status(404).json({ error: "Assignment not found" })
        return res.status(200).json({ deleted: true, id })
    } catch (err) {
        console.error("deleteAssignment error", err)
        return res.status(500).json({ error: "Internal server error" })
    }
}

export const getAllAssignments = async (req: Request, res: Response) => {
    try {
        const courseId = req.params.courseId
        if (!courseId) return res.status(400).json({ error: "Invalid id parameter" })

        const results = await Assignment.findAll({
            where: {
                courseId: courseId,
            },
        })
        return res.status(200).send({ data: results })
    } catch (err) {
        console.error("deleteAssignment error", err)
        return res.status(500).json({ error: "Internal server error" })
    }
}
