import { Request, Response } from "express"
import { Rubric } from "../../models/rubric/rubric.model"
import { Rubric_Levels } from "../../models/rubric/rubric_levels.model"

export async function createRubric(req: Request, res: Response) {
    try {
        const { name, description } = req.body

        const rubric = await Rubric.create({ name, description })

        res.status(201).json(rubric)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error creating rubric" })
    }
}

export async function listRubrics(req: Request, res: Response) {
    try {
        const rubrics = await Rubric.findAll()
        res.json(rubrics)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error listing rubrics" })
    }
}

export async function getRubric(req: Request, res: Response) {
    try {
        const id = Number(req.params.id)
        if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: "Invalid id" })

        const rubric = await Rubric.findByPk(id, {
            include: [
                {
                    model: Rubric_Levels,
                    as: "rubric_levels",
                },
            ],
        })

        if (!rubric) return res.status(404).json({ error: "Not found" })

        res.json(rubric)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error getting rubric" })
    }
}

//consolidate into one?
export async function createRubricEntry(req: Request, res: Response) {
    try {
        const { rubric_id, value, label, description, sort_order } = req.body

        const entry = await Rubric_Levels.create({
            rubric_id,
            value,
            label,
            description,
            sort_order,
        })

        if (!entry) return res.status(400).json({ error: "Failed to create rubric entry" })

        res.status(201).json(entry)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error creating rubric entry" })
    }
}
