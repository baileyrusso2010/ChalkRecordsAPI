import { Router } from "express"
import { listWblCategories } from "../../controller/wbl/wbl_catagories.controller"

const router = Router()

router.get("/", listWblCategories)

export default router
