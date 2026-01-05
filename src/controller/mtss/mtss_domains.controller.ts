import { Request, Response } from "express"
import { MTSS_Domains } from "../../models/mtss/mtss_domains.model"

export async function createDomain(req: Request, res: Response) {
    try {
        const domain = await MTSS_Domains.create(req.body)
        res.status(201).json(domain)
    } catch (err) {
        console.error("Error creating MTSS domain:", err)
        res.status(500).json({ error: "Failed to create MTSS domain" })
    }
}

export async function listDomains(req: Request, res: Response) {
    try {
        const domains = await MTSS_Domains.findAll()
        res.json(domains)
    } catch (err) {
        console.error("Error listing MTSS domains:", err)
        res.status(500).json({ error: "Failed to list MTSS domains" })
    }
}

export async function getDomain(req: Request, res: Response) {
    try {
        const { id } = req.params
        const domain = await MTSS_Domains.findByPk(id)
        if (!domain) {
            return res.status(404).json({ error: "MTSS domain not found" })
        }
        res.json(domain)
    } catch (err) {
        console.error("Error getting MTSS domain:", err)
        res.status(500).json({ error: "Failed to get MTSS domain" })
    }
}

export async function updateDomain(req: Request, res: Response) {
    try {
        const { id } = req.params
        const [updated] = await MTSS_Domains.update(req.body, { where: { id } })
        if (!updated) {
            return res.status(404).json({ error: "MTSS domain not found" })
        }
        const updatedDomain = await MTSS_Domains.findByPk(id)
        res.json(updatedDomain)
    } catch (err) {
        console.error("Error updating MTSS domain:", err)
        res.status(500).json({ error: "Failed to update MTSS domain" })
    }
}

export async function deleteDomain(req: Request, res: Response) {
    try {
        const { id } = req.params
        const deleted = await MTSS_Domains.destroy({ where: { id } })
        if (!deleted) {
            return res.status(404).json({ error: "MTSS domain not found" })
        }
        res.status(204).send()
    } catch (err) {
        console.error("Error deleting MTSS domain:", err)
        res.status(500).json({ error: "Failed to delete MTSS domain" })
    }
}
