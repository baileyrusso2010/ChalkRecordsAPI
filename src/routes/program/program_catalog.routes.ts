import { Router } from "express"
import {
    listProgramCatalogs,
    getProgramCatalog,
} from "../../controller/program/program_catalog.controller"

const router = Router()

router.get("/", listProgramCatalogs)
router.get("/:id", getProgramCatalog)

export default router
