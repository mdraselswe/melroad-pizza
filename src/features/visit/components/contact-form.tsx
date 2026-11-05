"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Info, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { errorId, Field } from "@/components/ui/field";
import { tenant } from "@/config/tenant";
import { t } from "@/i18n";
import { sendMessage } from "@/services/messages";
import { CONTACT_DEFAULTS, CONTACT_MESSAGE_MAX, contactSchema, type ContactValues } from "../contact-schema";

/** Short pause so sending feels like it went somewhere. */
const SEND_DELAY_MS = 700;

export function ContactForm() {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({ resolver: zodResolver(contactSchema), defaultValues: CONTACT_DEFAULTS });

  const onSubmit = handleSubmit(async (values) => {
    await new Promise((r) => setTimeout(r, SEND_DELAY_MS));
    sendMessage(values);
    setSentTo(values.name);
    reset(CONTACT_DEFAULTS);
  });

  const input = (name: keyof ContactValues, extra: Record<string, unknown> = {}) => ({
    id: `ct-${name}`,
    className: "field",
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? errorId(`ct-${name}`) : undefined,
    ...extra,
    ...register(name),
  });

  if (sentTo !== null)
    return (
      <div role="status" className="grid justify-items-start gap-4 py-6">
        <CheckCircle2 className="size-10 text-success" aria-hidden="true" />
        <p className="m-0 text-xl font-bold tracking-[-.02em]">{t("contact.sent", { name: sentTo })}</p>
        {tenant.demo.enabled ? <p className="m-0 text-[15px] text-muted">{t("contact.demo")}</p> : null}
        <Button variant="ghost" onClick={() => setSentTo(null)}>
          {t("contact.again")}
        </Button>
      </div>
    );

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="ct-name" label={t("contact.name")} error={errors.name?.message}>
          <input {...input("name", { autoComplete: "name" })} />
        </Field>
        <Field id="ct-email" label={t("contact.email")} error={errors.email?.message}>
          <input {...input("email", { autoComplete: "email", type: "email" })} />
        </Field>
      </div>
      <Field id="ct-phone" label={t("contact.phone")} error={errors.phone?.message}>
        <input {...input("phone", { autoComplete: "tel", type: "tel", inputMode: "tel", maxLength: 20 })} />
      </Field>
      <Field id="ct-message" label={t("contact.message")} error={errors.message?.message}>
        <textarea {...input("message", { rows: 4, maxLength: CONTACT_MESSAGE_MAX })} />
      </Field>
      {tenant.demo.enabled ? (
        <p className="m-0 flex items-start gap-2 text-[13.5px] text-muted">
          <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {t("contact.demo")}
        </p>
      ) : null}
      <Button type="submit" size="lg" disabled={isSubmitting} className="w-fit">
        {isSubmitting ? t("contact.sending") : t("contact.send")}
        <Send className="size-[17px]" aria-hidden="true" />
      </Button>
    </form>
  );
}
