import { AsyncLocalStorage } from "async_hooks"

interface TenantStore {
    district_id: number
}

const tenantStorage = new AsyncLocalStorage<TenantStore>()

export const runWithTenant = (districtId: number, callback: () => void) => {
    const store: TenantStore = { district_id: districtId }
    tenantStorage.run(store, callback)
}

export const getTenant = (): number | undefined => {
    const store = tenantStorage.getStore()
    return store?.district_id
}

export const requireTenant = (): number => {
    const tenant = getTenant()
    if (!tenant) {
        throw new Error(
            "Tenant context is missing. Ensure the request is running within tenantMiddleware.",
        )
    }
    return tenant
}
