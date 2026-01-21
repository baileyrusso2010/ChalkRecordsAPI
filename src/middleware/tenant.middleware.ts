import { Request, Response, NextFunction } from "express"
import { runWithTenant } from "../utils/tenant.context"

// Extend Express Request interface if needed, or assume user is attached by auth middleware
interface AuthenticatedRequest extends Request {
    user?: {
        district_id: number
        // ... other user properties
    }
}

export const tenantMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Assuming authentication middleware runs BEFORE this and attaches user to req
    // and that the user object contains the district_id.
    const districtId = req.user?.district_id

    if (!districtId) {
        // If no user or district_id, we might be in a public route or auth failed/not happened.
        // Depending on policy, we can either:
        // 1. Throw error (Strict Multi-tenancy)
        // 2. Continue without tenant context (Public/System context)

        // For now, let's log a warning and proceed without context?
        // Or if this is strictly for protected routes, return 400.
        // Given the request, we likely want to enforce it for protected routes.

        // If the route is NOT public, this should probably be an identifiable error.
        // But for safety during migration, let's call next() but logging could be good.
        // Ideally, auth middleware handles "Not Authenticated".
        // If authenticated but no district_id, that's a data integrity issue.

        // Let's assume strictness for now but allow bypassing if explicitly no user (e.g. login route).
        if (!req.user) {
            return next()
        }

        // If we have a user but no district_id, that's a problem for a multi-tenant app user.
        console.warn(`[TenantMiddleware] properties missing on user: ${JSON.stringify(req.user)}`)
        return next()
    }

    // Run the rest of the request chain within the tenant context
    runWithTenant(districtId, () => {
        next()
    })
}
