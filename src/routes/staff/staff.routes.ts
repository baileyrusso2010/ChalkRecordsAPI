import { Router } from "express"
import * as StaffController from "../../controller/staff/staff.controller"

const router = Router()

// Basic get all staff
router.get("/", StaffController.getAllStaff)

// Get teachers by program (existing)
router.get("/:id", StaffController.getTeachersByProgram)

// Role management
router.post("/:staffId/roles", StaffController.assignRoleToStaff)
router.delete("/:staffId/roles/:roleId", StaffController.removeRoleFromStaff)

export default router
