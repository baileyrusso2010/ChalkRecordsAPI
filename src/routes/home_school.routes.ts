import { Router } from "express"
import { listHomeSchools, getHomeSchool } from "../controller/home_school.controller"

const router = Router()

router.get("/", listHomeSchools)
router.get("/:id", getHomeSchool)

export default router
