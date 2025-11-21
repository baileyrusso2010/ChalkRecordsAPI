import { Request, Response } from "express"
import { Op } from "sequelize"
import { Grading_Categories } from "../models/gradebook/grading_categories.model"

export const insertGradingCategories = async (req: Request, res: Response) => {
    try {
        const { course_id, categories } = req.body

        const categoriesWithCourse = categories.map((cat: any, idx: number) => ({
            ...cat,
            course_instance_id: course_id,
            position: idx + 1,
        }))

        for (const cat of categoriesWithCourse) await Grading_Categories.upsert(cat)

        const response = await Grading_Categories.findAll({
            where: {
                course_instance_id: course_id,
            },
        })

        res.status(201).json({ message: "Categories updated", data: response })
    } catch (error) {
        res.status(500).json({ error: "Failed to create form" })
    }
}

export const updateGradingCategories = async (req: Request, res: Response) => {
    try {
        const { course_id, categories } = req.body
        console.log(req.body)

        const categoriesWithCourse = categories.map((cat: any, idx: number) => ({
            ...cat,
            course_instance_id: course_id,
            position: idx + 1,
        }))

        const upsertedCategories = []
        for (const cat of categoriesWithCourse) {
            const upserted = await Grading_Categories.upsert(cat)
            upsertedCategories.push(upserted[0]) // upsert returns [instance, created]
        }

        res.status(200).json({ message: "Categories updated", data: upsertedCategories })
    } catch (err) {
        res.status(500).json({ error: "Failed to create form" })
    }
}

export const getGradingCategories = async (req: Request, res: Response) => {
    try {
        const { course_id } = req.params

        const data = await Grading_Categories.findAll({
            where: {
                course_instance_id: course_id,
            },
        })

        if (data.length == 0) {
            return res.json({
                needsSetup: true,
                suggestedCategories: [
                    { name: "Homework / Classwork", weight: 20 },
                    { name: "Quizzes", weight: 20 },
                    { name: "Tests / Exams", weight: 40 },
                    { name: "Final Exam", weight: 20 },
                ],
            })
        }

        res.json({ needsSetup: false, data })
    } catch (error) {
        res.status(500).json({ error: "Failed to create form" })
    }
}
