const API_URL = "http://localhost:3000/api"

async function request(url: string, method: string, body?: any) {
    try {
        const headers: any = { "Content-Type": "application/json" }
        const options: any = { method, headers }
        if (body) options.body = JSON.stringify(body)

        const res = await fetch(url, options)
        if (!res.ok) {
            const text = await res.text()
            throw new Error(`Request failed: ${res.status} ${res.statusText} - ${text}`)
        }

        // Handle 204 No Content
        if (res.status === 204) return null

        return await res.json()
    } catch (error) {
        throw error
    }
}

async function verifyEndpoints() {
    try {
        console.log("Starting verification...")

        // 1. Create Permission
        console.log("Creating permission...")
        const permRes = await request(`${API_URL}/permissions`, "POST", {
            key: "TEST_PERMISSION",
            description: "Test Permission Description",
        })
        console.log("Created permission:", permRes)
        const permissionId = permRes.id

        // 2. Get All Permissions
        console.log("Getting all permissions...")
        const allPermsRes = await request(`${API_URL}/permissions`, "GET")
        console.log("All permissions count:", allPermsRes.length)

        // 3. Create Role
        console.log("Creating role...")
        const roleRes = await request(`${API_URL}/roles`, "POST", {
            name: "TEST_ROLE",
        })
        console.log("Created role:", roleRes)
        const roleId = roleRes.id

        // 4. Assign Permission to Role
        console.log("Assigning permission to role...")
        await request(`${API_URL}/roles/permissions`, "POST", {
            roleId,
            permissionId,
        })
        console.log("Permission assigned.")

        // 5. Get Role and Verify Permission
        console.log("Verifying role permissions...")
        const roleWithPerms = await request(`${API_URL}/roles/${roleId}`, "GET")
        console.log("Role with permissions:", JSON.stringify(roleWithPerms, null, 2))

        if (
            roleWithPerms.permissions &&
            roleWithPerms.permissions.some((p: any) => p.id === permissionId)
        ) {
            console.log("SUCCESS: Permission found in role.")
        } else {
            console.error("FAILURE: Permission not found in role.")
        }

        // Clean up
        console.log("Cleaning up...")
        await request(`${API_URL}/roles/${roleId}/permissions/${permissionId}`, "DELETE")
        await request(`${API_URL}/roles/${roleId}`, "DELETE")
        await request(`${API_URL}/permissions/${permissionId}`, "DELETE")
        console.log("Cleanup complete.")
    } catch (error: any) {
        console.error("Verification failed:", error.message)
    }
}

// Ensure the server is running before running this script
verifyEndpoints()
