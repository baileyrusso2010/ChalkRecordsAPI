import { Router } from "express"
import * as PermissionsController from "../controller/users/permissions.controller"

const router = Router()

router.post("/", PermissionsController.createPermission)
router.get("/", PermissionsController.getAllPermissions)
router.get("/:id", PermissionsController.getPermissionById)
router.put("/:id", PermissionsController.updatePermission)
router.delete("/:id", PermissionsController.deletePermission)

export default router
