import { DEFAULT_TENANT, TENANTS, type TenantId } from "@/tenants";
import { MenuSchema, type Menu } from "./menu-schema";
import { TenantSchema, type Tenant } from "./schema";

const isTenantId = (id: string): id is TenantId => id in TENANTS;

/** Resolves the tenant id from the environment, falling back to the default. */
export function resolveTenantId(raw: string | undefined): TenantId {
  if (!raw) return DEFAULT_TENANT;
  if (isTenantId(raw)) return raw;
  throw new Error(`Unknown NEXT_PUBLIC_TENANT "${raw}". Known tenants: ${Object.keys(TENANTS).join(", ")}`);
}

/**
 * Parses the bundle once. A broken config fails the build with a readable
 * zod error instead of shipping a half-working site.
 */
export function loadTenant(id: TenantId): { tenant: Tenant; menu: Menu } {
  const bundle = TENANTS[id];
  return { tenant: TenantSchema.parse(bundle.config), menu: MenuSchema.parse(bundle.menu) };
}

const loaded = loadTenant(resolveTenantId(process.env.NEXT_PUBLIC_TENANT));

export const tenant: Tenant = loaded.tenant;
export const menu: Menu = loaded.menu;
