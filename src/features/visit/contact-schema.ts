import { z } from "zod";
import { t } from "@/i18n";

export const CONTACT_MESSAGE_MAX = 1000;

/** "Send us a message" form rules. */
export const contactSchema = z.object({
  name: z.string().trim().min(2, t("error.name")),
  email: z.email(t("error.email")),
  phone: z.string().trim().max(20),
  message: z
    .string()
    .trim()
    .min(10, t("error.message"))
    .max(CONTACT_MESSAGE_MAX, t("error.messageLong", { max: CONTACT_MESSAGE_MAX })),
});

export type ContactValues = z.infer<typeof contactSchema>;

export const CONTACT_DEFAULTS: ContactValues = { name: "", email: "", phone: "", message: "" };
