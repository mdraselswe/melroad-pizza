import type { MenuInput } from "@/config/menu-schema";
import type { TenantInput } from "@/config/schema";
import { melroadConfig } from "./melroad/config";
import { melroadMenu } from "./melroad/menu";
import { basilBrickConfig } from "./basil-brick/config";
import { basilBrickMenu } from "./basil-brick/menu";

export interface TenantBundle {
  config: TenantInput;
  menu: MenuInput;
}

/**
 * Every client the product can be demoed for. Pick one at build time with
 * `NEXT_PUBLIC_TENANT=<id>` — see docs/white-label.md.
 */
export const TENANTS = {
  melroad: { config: melroadConfig, menu: melroadMenu },
  "basil-brick": { config: basilBrickConfig, menu: basilBrickMenu },
} satisfies Record<string, TenantBundle>;

export type TenantId = keyof typeof TENANTS;
export const DEFAULT_TENANT: TenantId = "melroad";
