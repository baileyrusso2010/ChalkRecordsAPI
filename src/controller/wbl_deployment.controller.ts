import { Request, Response } from "express"
import { v4 as uuidv4 } from "uuid"
import { WBL_Deployment_Recipients } from "../models/wbl/wbl_deployment_recipients.model"
import { Student } from "../models/student.model"
import { WBL_Hours } from "../models/wbl/wbl_hours.model"

export async function createDeployment(req: Request, res: Response) {
    const token = uuidv4()

    try {
        await WBL_Deployment_Recipients.create({
            deployment_id: 1,
            student_id: 792,
            token: token,
            expires_at: new Date("05/03/2025"),
        })

        res.send("Success")
    } catch (err) {
        console.error("Error listing WBL categories", err)
        res.status(500).json({ error: "Failed to list WBL categories" })
    }
}

export async function updateHours(req: Request, res: Response) {
    const { token, hours, catagory_id, comments } = req.body

    try {
        const recipient = await WBL_Deployment_Recipients.findOne({
            where: {
                token: token,
                submitted: false,
            },
            include: [{ model: Student, as: "student" }],
        })

        if (!recipient) {
            return res.status(404).json({ error: "Invalid token" })
        }

        await Promise.all([
            WBL_Hours.create({
                student_id: recipient.student_id,
                catagory_id,
                hours,
                date: new Date(),
                comments,
            }),
            WBL_Deployment_Recipients.update(
                {
                    submitted: true,
                },
                {
                    where: {
                        token: token,
                    },
                }
            ),
        ])

        res.send("Success")
    } catch (err) {
        console.error("Error Updating", err)
        res.status(500).json({ error: "Error Updating WBL" })
    }
}

//do we need to expose put?

export async function getDeployment(req: Request, res: Response) {
    const { token } = req.params

    try {
        const results = await WBL_Deployment_Recipients.findOne({
            where: {
                token: token,
            },
            attributes: ["student_id", "submitted"],
            // include: [{ model: Student, as: "student" }],
        })
        if (!results) return res.status(404).json({ error: "Invalid token" })
        if (results.submitted) return res.status(404).json({ error: "Already Submitted" })
        if (results.expires_at && new Date() > results.expires_at) {
            return res.status(404).json({ error: "Date Passed" })
        }

        res.status(200).json(results)
    } catch (err) {
        console.error("Error listing WBL categories", err)
        res.status(500).json({ error: "Failed to list WBL categories" })
    }
}
