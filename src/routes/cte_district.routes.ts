import { Router } from "express"
import {
    listDistricts,
    getDistrict,
    getDistrictSchools,
} from "../controller/cte_district.controller"

const router = Router()

router.get("/", listDistricts)
router.get("/:id", getDistrict)
router.get("/:id/schools", getDistrictSchools)

export default router
