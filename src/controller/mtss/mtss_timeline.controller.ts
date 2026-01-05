import { Request, Response } from "express"
import { Screenings } from "../../models/mtss/screenings.model"
import { MTSS_Student_Tiers } from "../../models/mtss/mtss_student_tiers.model"
import { Student_Interventions } from "../../models/mtss/student_interventions.model"
import { Progress_Monitoring } from "../../models/mtss/progress_monitoring.model"
import { MTSS_Meetings } from "../../models/mtss/mtss_meetings.model"
import { MTSS_Decisions } from "../../models/mtss/mtss_decisions.model"
import { Referrals } from "../../models/mtss/referrals.model"
import { Interventions } from "../../models/mtss/interventions.model"

export async function getMTSSTimeline(req: Request, res: Response) {
    try {
        const { studentId } = req.params

        const [screenings, tiers, interventions, meetings, referrals] = await Promise.all([
            Screenings.findAll({ where: { student_id: studentId } }),
            MTSS_Student_Tiers.findAll({ where: { student_id: studentId } }),
            Student_Interventions.findAll({
                where: { student_id: studentId },
                include: [Interventions], // Include details for the frontend
            }),
            MTSS_Meetings.findAll({ where: { student_id: studentId } }),
            Referrals.findAll({ where: { student_id: studentId } }),
        ])

        // For progress monitoring, we need to find entries linked to the student's interventions
        // We can use the IDs from the interventions we just fetched
        const interventionIds = interventions.map((i: any) => i.id)

        const progress = await Progress_Monitoring.findAll({
            where: {
                student_intervention_id: interventionIds,
            },
            order: [["measurement_date", "ASC"]],
        })

        // For decisions, we need entries linked to the meetings
        const meetingIds = meetings.map((m: any) => m.id)

        const decisions = await MTSS_Decisions.findAll({
            where: {
                meeting_id: meetingIds,
            },
        })

        res.json({
            screenings,
            tiers,
            interventions,
            progress,
            meetings,
            decisions,
            referrals,
        })
    } catch (err) {
        console.error("Error generating MTSS timeline:", err)
        res.status(500).json({ error: "Failed to generate MTSS timeline" })
    }
}
