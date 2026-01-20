import { Router } from "express"
import * as RolesController from "../controller/users/roles.controller"

const router = Router()

router.post("/", RolesController.createRole)
router.get("/", RolesController.getAllRoles)
router.get("/:id", RolesController.getRoleById)
router.put("/:id", RolesController.updateRole)
router.delete("/:id", RolesController.deleteRole)
router.post("/permissions", RolesController.addPermissionToRole)
router.delete("/:roleId/permissions/:permissionId", RolesController.removePermissionFromRole)

export default router
