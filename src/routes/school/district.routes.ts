import { Router } from "express"
import {
    listDistricts,
    getDistrict,
    getDistrictSchools,
    getDistrictCurrentPrograms,
} from "../../controller/school/district.controller"

const router = Router()

router.get("/", listDistricts)
router.get("/:id", getDistrict)
router.get("/:id/schools", getDistrictSchools)
router.get("/:id/programs/current", getDistrictCurrentPrograms)

export default router
