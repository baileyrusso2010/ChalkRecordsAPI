import sequelize from "../database"
import { Permissions } from "../models/users/permissions.model"

const PERMISSIONS_LIST = [
    // User Management
    { key: "user:read", description: "View users and staff" },
    { key: "user:write", description: "Create and edit users" },
    { key: "user:delete", description: "Delete users" },

    // Roles & Permissions
    { key: "rbac:read", description: "View roles and permissions" },
    { key: "rbac:write", description: "Manage roles and assign permissions" },

    // MTSS
    { key: "mtss:read", description: "View MTSS data (timeline, interventions, etc)" },
    { key: "mtss:write", description: "Manage MTSS records" },

    // Forms/Evaluations
    { key: "forms:read", description: "View evaluation forms" },
    { key: "forms:write", description: "Fill out and submit forms" },

    // Gradebook
    { key: "grades:read", description: "View gradebook" },
    { key: "grades:write", description: "Edit grades" },
]

async function seedPermissions() {
    try {
        await sequelize.authenticate()
        console.log("Database connected.")

        // Sync model to ensure table exists (dev only, or use migrations in prod)
        await Permissions.sync({ alter: true })

        for (const p of PERMISSIONS_LIST) {
            const [perm, created] = await Permissions.findOrCreate({
                where: { key: p.key },
                defaults: p,
            })
            if (created) {
                console.log(`Created permission: ${p.key}`)
            } else {
                console.log(`Permission exists: ${p.key}`)
                await perm.update(p) // Update description if changed
            }
        }

        console.log("Permissions seeding complete.")
    } catch (err) {
        console.error("Seeding failed:", err)
    } finally {
        await sequelize.close()
    }
}

seedPermissions()
