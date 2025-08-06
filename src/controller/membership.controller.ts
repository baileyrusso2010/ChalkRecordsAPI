import { Request, Response } from "express"
import { Student } from "../models/student.model"
import { Membership } from "../models/membership.model"
import { StudentMemberships } from "../models/student_membership.model"
import { ac } from "@faker-js/faker/dist/airline-CLphikKp"

export const getStudentMemberships = async (req: Request, res: Response) => {
    const studentId = req.params.id

    try {
        //maybe active memberships only?
        const sm = await StudentMemberships.findAll({
            where: {
                student_id: studentId,
            },
        })

        if (!sm || sm.length === 0) {
            return res.status(404).json({ error: "No memberships found for this student" })
        }

        res.status(200).json(sm)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to obtain student memberships" })
    }
}

export const insertStudentMembership = async (req: Request, res: Response) => {
    const studentId = req.params.id

    try {
        const membership = await StudentMemberships.create({
            student_id: studentId,
            membership_id: req.body.membership_id,
            active: true, // default to true if not provided
        })

        res.status(201).json(membership)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to obtain student memberships" })
    }
}

export const updateStudentMembership = async (req: Request, res: Response) => {
    const studentMembershipId = req.params.id

    try {
        const studentMembership = await StudentMemberships.findByPk(studentMembershipId)

        if (!studentMembership) {
            return res.status(404).json({ error: "Student membership not found" })
        }

        await studentMembership.update(req.body)

        res.status(200).json(studentMembership)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to update student membership" })
    }
}

//just get all to dispaly
export const getMemberships = async (req: Request, res: Response) => {
    try {
        const memberships = await Membership.findAll({})

        if (!memberships || memberships.length === 0) {
            return res.status(404).json({ error: "No memberships found" })
        }

        res.status(200).json(memberships)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to obtain memberships" })
    }
}

export const updateMembership = async (req: Request, res: Response) => {
    const membershipId = req.params.id
    try {
        const membership = await Membership.findByPk(membershipId)

        if (!membership) {
            return res.status(404).json({ error: "Membership not found" })
        }

        await membership.update(req.body)

        res.status(200).json(membership)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to update membership" })
    }
}

//think about how to handle cascade deletes where a membership is deleted
export const deleteMembership = async (req: Request, res: Response) => {
    const membershipId = req.params.id

    try {
        const membership = await StudentMemberships.findByPk(membershipId)

        if (!membership) {
            return res.status(404).json({ error: "Membership not found" })
        }

        await membership.destroy()

        res.status(200).json({ message: "Membership deleted successfully" })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to delete membership" })
    }
}

export const createMembership = async (req: Request, res: Response) => {
    try {
        const newMembership = await Membership.create(req.body)

        res.status(201).json(newMembership)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to create membership" })
    }
}
