import { Request, Response } from "express"
import { SkillCategory } from "../models/skill_category.model"
import { Skill } from "../models/skill.model"

// GET /skill
// Optional query params: search (matches title or state_program_code), code (exact), title (partial)
export async function getSkills(req: Request, res: Response) {
    try {
        const category_id = req.params.category_id

        let data = await Skill.findAll({
            where: {
                category_id,
            },
        })

        res.send(data)
    } catch (e) {
        console.error("Failed to get skills", e)
        res.status(500).json({ error: "Failed to list program catalogs" })
    }
}

export async function upsertSkill(req: Request, res: Response) {
    try {
        const [skill, created] = await Skill.upsert(req.body, { returning: true })

        res.status(created ? 201 : 200).json(skill)
    } catch (e) {
        console.error("Failed to get skills", e)
        res.status(500).json({ error: "Failed to list program catalogs" })
    }
}
