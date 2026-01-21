import { Request, Response, NextFunction } from "express"
// Models are imported only for type usage if needed, but here we rely on the object structure attached to req
// import { Staff } from "../models/users/staff.model"
// import { Roles } from "../models/users/roles.model"
// import { Permissions } from "../models/users/permissions.model"

/**
 * Middleware to check if the authenticated user has the required permission(s).
 * Assumes req.user is populated by previous authentication middleware.
 *
 * @param requiredPermissions - A single permission string or an array of permission strings.
 *                              If an array, the user must have AT LEAST ONE of the permissions.
 */
export const checkPermissions = (requiredPermissions: string | string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // 1. Check if user and staff context are present
            const request = req as any
            if (!request.user || !request.staff) {
                return res
                    .status(401)
                    .json({ message: "Unauthorized: User context or staff data missing" })
            }

            // 2. Flatten permissions from loaded staff object
            // We expect req.staff to be fully loaded with Roles and Permissions by requireAuth
            const userRoles = request.staff.roles || []
            const userPermissions = new Set<string>()

            for (const role of userRoles) {
                if (role.permissions) {
                    for (const perm of role.permissions) {
                        userPermissions.add(perm.key)
                    }
                }
            }

            // 4. Check requirements
            const required = Array.isArray(requiredPermissions)
                ? requiredPermissions
                : [requiredPermissions]

            const hasPermission = required.some((perm) => userPermissions.has(perm))

            if (!hasPermission) {
                return res.status(403).json({
                    message: "Forbidden: Insufficient permissions",
                    required: required,
                })
            }

            // 5. Success
            next()
        } catch (error) {
            console.error("Error in checkPermissions middleware:", error)
            return res
                .status(500)
                .json({ message: "Internal Server Error during permission check" })
        }
    }
}
