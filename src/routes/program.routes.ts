import { Router } from "express"
import {
    getAllProgamCatalog,
    insertProgram,
    getActiveProgram,
} from "../controller/program.controller"

const router = Router()

// Program catalogs (reference data)
router.get("/program-catalogs", getAllProgamCatalog)

// Programs collection (active / filtered list)
router.get("/programs", getActiveProgram)

// Create program
router.post("/programs", insertProgram)

export default router
