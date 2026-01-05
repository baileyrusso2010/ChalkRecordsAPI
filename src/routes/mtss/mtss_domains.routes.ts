import { Router } from "express"
import {
    createDomain,
    listDomains,
    getDomain,
    updateDomain,
    deleteDomain,
} from "../../controller/mtss/mtss_domains.controller"

const router = Router()

router.post("/", createDomain)
router.get("/", listDomains)
router.get("/:id", getDomain)
router.put("/:id", updateDomain)
router.delete("/:id", deleteDomain)

export default router
