import { Request, Response } from "express"
import { MTSS_Meetings } from "../../models/mtss/mtss_meetings.model"

export async function createMeeting(req: Request, res: Response) {
    try {
        const meeting = await MTSS_Meetings.create(req.body)
        res.status(201).json(meeting)
    } catch (err) {
        console.error("Error creating MTSS meeting:", err)
        res.status(500).json({ error: "Failed to create MTSS meeting" })
    }
}

export async function listMeetings(req: Request, res: Response) {
    try {
        const { student_id } = req.query
        const where: any = {}
        if (student_id) {
            where.student_id = student_id
        }

        const meetings = await MTSS_Meetings.findAll({ where })
        res.json(meetings)
    } catch (err) {
        console.error("Error listing MTSS meetings:", err)
        res.status(500).json({ error: "Failed to list MTSS meetings" })
    }
}

export async function getMeeting(req: Request, res: Response) {
    try {
        const { id } = req.params
        const meeting = await MTSS_Meetings.findByPk(id)
        if (!meeting) {
            return res.status(404).json({ error: "MTSS meeting not found" })
        }
        res.json(meeting)
    } catch (err) {
        console.error("Error getting MTSS meeting:", err)
        res.status(500).json({ error: "Failed to get MTSS meeting" })
    }
}

export async function updateMeeting(req: Request, res: Response) {
    try {
        const { id } = req.params
        const [updated] = await MTSS_Meetings.update(req.body, { where: { id } })
        if (!updated) {
            return res.status(404).json({ error: "MTSS meeting not found" })
        }
        const updatedMeeting = await MTSS_Meetings.findByPk(id)
        res.json(updatedMeeting)
    } catch (err) {
        console.error("Error updating MTSS meeting:", err)
        res.status(500).json({ error: "Failed to update MTSS meeting" })
    }
}

export async function deleteMeeting(req: Request, res: Response) {
    try {
        const { id } = req.params
        const deleted = await MTSS_Meetings.destroy({ where: { id } })
        if (!deleted) {
            return res.status(404).json({ error: "MTSS meeting not found" })
        }
        res.status(204).send()
    } catch (err) {
        console.error("Error deleting MTSS meeting:", err)
        res.status(500).json({ error: "Failed to delete MTSS meeting" })
    }
}
