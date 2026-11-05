import { z } from "zod";
import type { Tenant } from "@/config/schema";
import { t } from "@/i18n";

const digits = (s: string) => s.replace(/\D/g, "");

/** Checkout form rules; delivery-only fields are checked only for delivery. */
export function checkoutSchema(delivery: Tenant["ordering"]["delivery"]) {
  return z
    .object({
      mode: z.enum(["pickup", "delivery"]),
      when: z.enum(["asap", "later"]),
      slot: z.string(),
      name: z.string().trim().min(2, t("error.name")),
      phone: z
        .string()
        .trim()
        .refine(
          (v) => digits(v).length >= 8 && digits(v).length <= 15 && /^[+\d\s()-]+$/.test(v),
          t("error.phone"),
        ),
      email: z.union([z.literal(""), z.email(t("error.email"))]),
      street: z.string().trim(),
      suburb: z.string().trim(),
      postcode: z.string().trim(),
      notes: z.string().trim().max(300),
      payment: z.enum(["store", "card"]),
    })
    .superRefine((v, ctx) => {
      if (v.when === "later" && !v.slot)
        ctx.addIssue({ code: "custom", path: ["slot"], message: t("error.slot") });
      if (v.mode !== "delivery") return;
      if (v.street.length < 3) ctx.addIssue({ code: "custom", path: ["street"], message: t("error.street") });
      if (v.suburb.length < 2) ctx.addIssue({ code: "custom", path: ["suburb"], message: t("error.suburb") });
      if (!/^\d{4}$/.test(v.postcode))
        ctx.addIssue({ code: "custom", path: ["postcode"], message: t("error.postcode") });
      else if (!delivery.postcodes.includes(v.postcode))
        ctx.addIssue({
          code: "custom",
          path: ["postcode"],
          message: t("error.zone", { postcode: v.postcode }),
        });
    });
}

export type CheckoutValues = z.infer<ReturnType<typeof checkoutSchema>>;

export const CHECKOUT_DEFAULTS: CheckoutValues = {
  mode: "pickup",
  when: "asap",
  slot: "",
  name: "",
  phone: "",
  email: "",
  street: "",
  suburb: "",
  postcode: "",
  notes: "",
  payment: "store",
};
