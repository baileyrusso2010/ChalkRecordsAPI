import { Router } from "express"
import {
    listDistrictPrograms,
    getDistrictProgram,
    createDistrictProgram,
    updateDistrictProgram,
    deleteDistrictProgram,
} from "../../controller/cte/cte_district_program.controller"

const router = Router()

router.get("/", listDistrictPrograms)
router.get("/:id", getDistrictProgram)
router.post("/", createDistrictProgram)
router.put("/:id", updateDistrictProgram)
router.delete("/:id", deleteDistrictProgram)

export default router
