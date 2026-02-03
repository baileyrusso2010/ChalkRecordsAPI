import * as dotenv from "dotenv"
import path from "path"
dotenv.config({ path: path.resolve(__dirname, "../../.env") })

import { School } from "../models/school/school.model"
import { Staff } from "../models/users/staff.model"
import { Roles } from "../models/users/roles.model"
import { Permissions } from "../models/users/permissions.model"
import { Staff_Roles } from "../models/users/staff_roles.model"
import sequelize from "../database"

const API_URL = "http://localhost:3000/api"

// Helper for requests
async function request(url: string, method: string, body?: any, staffEmail?: string) {
    try {
        const headers: any = { "Content-Type": "application/json" }
        // Simulate auth via custom header if we implemented dev auth, or just assume no auth for now
        // NOTE: Our previous plan mentioned 'Dev Auth' but we didn't confirm implementation of middleware changes.
        // Let's assume for this script we are just testing the endpoints directly if they are public OR
        // if we are testing internal logic.
        // Since we didn't implement the "Dev Auth Bypass" in middleware yet (it wasn't in the last execution steps),
        // we might hit 401.
        // CHECK: The middleware 'requireAuth' is only used if IS_PROD is true in index.ts?
        // Let's check index.ts to see if auth is skipped in dev.

        const options: any = { method, headers }
        if (body) options.body = JSON.stringify(body)

        const res = await fetch(url, options)
        if (!res.ok) {
            const text = await res.text()
            // return null if 404 to handle gracefully? no.
            throw new Error(`Request failed: ${res.status} ${res.statusText} - ${text}`)
        }
        if (res.status === 204) return null
        return await res.json()
    } catch (error) {
        throw error
    }
}

async function verifyBackendLogic() {
    try {
        await sequelize.authenticate()
        console.log("DB Connected")

        // 1. Setup Data
        // Create Role
        const [role, created] = await Roles.findOrCreate({ where: { name: "TEST_ADMIN" } })
        console.log("Role:", role.id)

        // Create Permission
        const [perm] = await Permissions.findOrCreate({
            where: { key: "test:perm", description: "Test" },
        })

        // Assign Permission to Role (using API or direct DB? Let's use DB to speed up setup)
        // Actually let's use the new API to test it
        // BUT wait, we need a Staff first
        // And we need to know if the API is protected.

        // 2. Test Staff API
        console.log("Testing GET /staff...")
        const allStaff = await request(`${API_URL}/staff`, "GET")
        console.log(`Fetched ${allStaff.length} staff members`)

        if (allStaff.length > 0) {
            const staffId = allStaff[0].id
            console.log(`Testing Role Assignment for Staff ${staffId}...`)

            // Assign
            await request(`${API_URL}/staff/${staffId}/roles`, "POST", { roleId: role.id })
            console.log("Role assigned.")

            // Verify
            const updatedStaffList = await request(`${API_URL}/staff`, "GET")
            const updatedStaff = updatedStaffList.find((s: any) => s.id === staffId)
            const hasRole = updatedStaff.roles.some((r: any) => r.id === role.id)
            if (hasRole) console.log("SUCCESS: Role found on staff.")
            else console.error("FAILURE: Role not found on staff.")

            // Remove
            await request(`${API_URL}/staff/${staffId}/roles/${role.id}`, "DELETE")
            console.log("Role removed.")
        } else {
            console.warn(
                "No staff found to test role assignment. Create a staff member manually first.",
            )
        }
    } catch (err: any) {
        console.error("Verification Error:", err.message)
    } finally {
        await sequelize.close()
    }
}

verifyBackendLogic()
