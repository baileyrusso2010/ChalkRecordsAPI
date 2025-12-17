import { Request, Response } from "express"
import { WBL_Catagories } from "../../models/wbl/wbl_catagories.model"

// GET /wbl-categories
export async function listWblCategories(req: Request, res: Response) {
    try {
        const categories = await WBL_Catagories.findAll({ order: [["name", "ASC"]] })
        res.json(categories)
    } catch (err) {
        console.error("Error listing WBL categories", err)
        res.status(500).json({ error: "Failed to list WBL categories" })
    }
}
