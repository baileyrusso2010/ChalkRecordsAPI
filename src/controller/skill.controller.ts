import { Request, Response } from "express"
import { SkillCategory } from "../models/skill_category.model"
import { Skill } from "../models/skill.model"
import { SkillScore } from "../models/skill_score.model"

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

export async function bulkCreateOrUpdate(req: Request, res: Response) {
    try {
        const records = req.body
        const toUpdate = records.filter((r: any) => r.id)
        const toCreate = records.filter((r: any) => !r.id)

        // Create new records
        let created: any = []
        if (toCreate.length > 0) {
            created = await Skill.bulkCreate(toCreate, { returning: true })
        }

        // Update existing records
        let updated = []
        if (toUpdate.length > 0) {
            // Update each record individually
            updated = await Promise.all(
                toUpdate.map(async (item: any) => {
                    await Skill.update(item, { where: { id: item.id } })
                    return Skill.findByPk(item.id)
                })
            )
        }

        res.status(200).json([...created, ...updated])
    } catch (e) {
        console.error("Failed to bulk create or update skills", e)
        res.status(500).json({ error: "Failed to bulk create or update skills" })
    }
}

//student skills

export async function getStudentSkills(req: Request, res: Response) {
    try {
        const { category_id } = req.params

        let results = await Skill.findAll({
            include: [SkillScore],
            where: {
                category_id,
                active: true,
            },
        })

        res.send(results)
    } catch (e) {
        console.error("Failed to get skills", e)
        res.status(500).json({ error: "Failed to get skills" })
    }
}

export async function upsertSkillScores(req: Request, res: Response) {
    try {
        const payload = req.body // Array of skill score objects

        const results = await Promise.all(
            payload.map(async (item: any) => {
                // If id exists, update; else, create
                if (item.id) {
                    await SkillScore.update(item, { where: { id: item.id } })
                    return SkillScore.findByPk(item.id)
                } else {
                    return SkillScore.create(item)
                }
            })
        )

        res.status(200).json(results)
    } catch (e) {
        console.error("Failed to upsert skill scores", e)
        res.status(500).json({ error: "Failed to upsert skill scores" })
    }
}
// ...existing code...
