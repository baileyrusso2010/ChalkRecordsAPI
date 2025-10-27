import { Router } from "express"
import {
    addOccupationalSkills,
    deleteOccupationalSkill,
    getForm,
    updateOccupationalSkills,
} from "../controller/form.controller"

const router = Router()

router.get("/:id", getForm)
router.post("/:id/occupational", addOccupationalSkills)
router.put("/:id/occupational", updateOccupationalSkills)
router.delete("/:id/occupational", deleteOccupationalSkill)

export default router
