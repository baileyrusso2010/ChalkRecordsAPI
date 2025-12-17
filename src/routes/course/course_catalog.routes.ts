import { Router } from "express"
import {
    listCourseCatalogs,
    getCourseCatalog,
} from "../../controller/course/coure.catalog.controller"

const router = Router()

router.get("/", listCourseCatalogs)
router.get("/:id", getCourseCatalog)

export default router
