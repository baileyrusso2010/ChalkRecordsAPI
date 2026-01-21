import { Router } from "express"
import { getSchoolDistrict, getSchools } from "../../controller/school/school.controller"

const router = Router()

router.get("/:district_id", getSchoolDistrict)
router.get("/district/:district_id", getSchools)

export default router
