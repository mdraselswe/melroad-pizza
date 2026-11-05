import { tDynamic } from "@/i18n";

/** Display names for ids that come from tenant data. */
export const sizeLabel = (id: string) => tDynamic(`size.${id}`, id);
export const baseLabel = (id: string) => tDynamic(`base.${id}`, id);
