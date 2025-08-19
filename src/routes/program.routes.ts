import { Router } from "express"
import {
    getAllProgamCatalog,
    insertProgram,
    getActiveProgram,
} from "../controller/program.controller"

const router = Router()

router.get("/program-catalogs", getAllProgamCatalog)
router.post("/programs", insertProgram)
router.get("/programs", getActiveProgram)

export default router
