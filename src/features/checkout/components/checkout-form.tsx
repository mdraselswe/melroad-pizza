"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard, Info, Store } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Button, ButtonLink } from "@/components/ui/button";
import { errorId, Field } from "@/components/ui/field";
import { Segmented } from "@/components/ui/segmented";
import { tenant } from "@/config/tenant";
import { ROUTES } from "@/constants/routes";
import { selectSubtotal, useCartHydrated, useCartStore } from "@/features/cart";
import { t } from "@/i18n";
import { cn } from "@/lib/cn";
import { money } from "@/lib/format";
import { orderTotals } from "@/lib/pricing";
import { createOrder } from "@/services/orders";
import { CHECKOUT_DEFAULTS, checkoutSchema, type CheckoutValues } from "../checkout-schema";
import { dueTime, useCheckoutSlots } from "../use-checkout-slots";
import { OrderSummary } from "./order-summary";

const { delivery, pickup } = tenant.ordering;
const schema = checkoutSchema(delivery);
/** Short pause so placing an order feels like it went somewhere. */
const PLACE_DELAY_MS = 900;

function Step({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <fieldset className="glass m-0 grid min-w-0 gap-4 rounded-[var(--radius-panel)] border-0 p-[22px]">
      <legend className="sr-only">{title}</legend>
      <h2 aria-hidden="true" className="m-0 flex items-center gap-2.5 text-lg font-bold tracking-[-.02em]">
        <span className="grid size-7 place-items-center rounded-full bg-accent text-sm text-on-accent">
          {n}
        </span>
        {title}
      </h2>
      {children}
    </fieldset>
  );
}

function PayOption({
  checked,
  onSelect,
  icon,
  title,
  hint,
}: {
  checked: boolean;
  onSelect: () => void;
  icon: ReactNode;
  title: string;
  hint: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      onClick={onSelect}
      className={cn(
        "flex items-start gap-3 rounded-2xl border p-4 text-left transition-colors",
        checked ? "border-accent bg-faint" : "border-line hover:border-muted",
      )}
    >
      <span className={cn("mt-0.5", checked ? "text-accent" : "text-muted")}>{icon}</span>
      <span className="grid">
        <b className="text-[15px]">{title}</b>
        <small className="text-[13px] text-muted">{hint}</small>
      </span>
    </button>
  );
}

export function CheckoutForm() {
  const router = useRouter();
  const hydrated = useCartHydrated();
  const lines = useCartStore((s) => s.lines);
  const subtotal = useCartStore(selectSubtotal);
  const clear = useCartStore((s) => s.clear);
  const [placing, setPlacing] = useState(false);

  const form = useForm<CheckoutValues>({
    resolver: zodResolver(schema),
    defaultValues: { ...CHECKOUT_DEFAULTS, mode: pickup.enabled ? "pickup" : "delivery" },
    mode: "onTouched",
  });
  const { register, handleSubmit, setValue, control, formState } = form;
  const { errors } = formState;
  const [mode, when, slot, payment] = useWatch({ control, name: ["mode", "when", "slot", "payment"] });

  const { now, moment, canAsap, groups, prepMinutes } = useCheckoutSlots(mode);
  const totals = orderTotals(subtotal, mode, delivery);
  const blocked = mode === "delivery" && totals.belowMinimum > 0;

  // Closed right now: the only option is to schedule.
  useEffect(() => {
    if (moment && !canAsap && when === "asap") setValue("when", "later");
  }, [moment, canAsap, when, setValue]);

  // Keep the chosen slot valid when the list changes (mode switch, time passing).
  const slotValues = useMemo(() => new Set(groups.flatMap((g) => g.slots.map((s) => s.value))), [groups]);
  useEffect(() => {
    if (slot && !slotValues.has(slot)) setValue("slot", "");
  }, [slot, slotValues, setValue]);

  const modeOptions = [
    pickup.enabled && {
      id: "pickup" as const,
      label: t("checkout.pickup"),
      hint: t("checkout.pickupHint", { minutes: pickup.prepMinutes }),
    },
    delivery.enabled && {
      id: "delivery" as const,
      label: t("checkout.delivery"),
      hint: t("checkout.deliveryHint", { minutes: delivery.prepMinutes, fee: money(delivery.fee) }),
    },
  ].filter((o) => !!o);

  const onSubmit = handleSubmit(async (values) => {
    if (!now || !moment || blocked || !lines.length) return;
    setPlacing(true);
    await new Promise((r) => setTimeout(r, PLACE_DELAY_MS));
    const order = createOrder({
      mode: values.mode,
      scheduled: values.when === "later",
      dueAt: dueTime(now, moment, prepMinutes, values.when === "later" ? values.slot : undefined),
      customer: { name: values.name, phone: values.phone, email: values.email || undefined },
      address:
        values.mode === "delivery"
          ? { street: values.street, suburb: values.suburb, postcode: values.postcode }
          : undefined,
      notes: values.notes || undefined,
      payment: values.payment,
      lines,
      totals,
    });
    clear();
    router.push(ROUTES.order(order.id));
  });

  if (!hydrated) return <div className="h-[480px] animate-pulse rounded-[var(--radius-panel)] bg-faint" />;

  if (!lines.length && !placing)
    return (
      <div className="glass grid justify-items-start gap-4 rounded-[var(--radius-panel)] p-8">
        <p className="m-0 text-xl font-semibold">{t("checkout.empty")}</p>
        <ButtonLink href={ROUTES.menu}>{t("cart.empty.cta")}</ButtonLink>
      </div>
    );

  const input = (name: keyof CheckoutValues, extra: Record<string, unknown> = {}) => ({
    id: `co-${name}`,
    className: "field",
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? errorId(`co-${name}`) : undefined,
    ...extra,
    ...register(name),
  });

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_400px]"
    >
      <div className="grid min-w-0 gap-5">
        <Step n={1} title={t("checkout.mode")}>
          {modeOptions.length > 1 ? (
            <Segmented
              label={t("checkout.mode")}
              options={modeOptions}
              value={mode}
              onChange={(v) => setValue("mode", v, { shouldValidate: formState.isSubmitted })}
            />
          ) : (
            <p className="m-0 text-muted">{modeOptions[0]?.hint}</p>
          )}
          {mode === "delivery" ? (
            <div className="grid gap-3 sm:grid-cols-[2fr_1.2fr_1fr]">
              <Field id="co-street" label={t("checkout.street")} error={errors.street?.message}>
                <input {...input("street", { autoComplete: "address-line1" })} />
              </Field>
              <Field id="co-suburb" label={t("checkout.suburb")} error={errors.suburb?.message}>
                <input {...input("suburb", { autoComplete: "address-level2" })} />
              </Field>
              <Field id="co-postcode" label={t("checkout.postcode")} error={errors.postcode?.message}>
                <input
                  {...input("postcode", { autoComplete: "postal-code", inputMode: "numeric", maxLength: 4 })}
                />
              </Field>
            </div>
          ) : null}
        </Step>

        <Step n={2} title={t("checkout.time")}>
          {moment && !canAsap ? (
            <p className="m-0 flex items-center gap-2 text-[15px] text-muted">
              <Info className="size-4 shrink-0 text-accent" aria-hidden="true" />
              {t("checkout.closedNow")}
            </p>
          ) : (
            <Segmented
              label={t("checkout.time")}
              options={[
                { id: "asap" as const, label: t("checkout.asap") },
                { id: "later" as const, label: t("checkout.later") },
              ]}
              value={when}
              onChange={(v) => setValue("when", v, { shouldValidate: formState.isSubmitted })}
            />
          )}
          {when === "later" ? (
            <Field id="co-slot" label={t("checkout.slot")} error={errors.slot?.message}>
              <select {...input("slot")}>
                <option value="">—</option>
                {groups.map((g) => (
                  <optgroup key={g.label} label={g.label}>
                    {g.slots.map((s) => (
                      <option key={s.value} value={s.value}>
                        {g.label} · {s.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </Field>
          ) : null}
        </Step>

        <Step n={3} title={t("checkout.details")}>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field id="co-name" label={t("checkout.name")} error={errors.name?.message}>
              <input {...input("name", { autoComplete: "name" })} />
            </Field>
            <Field id="co-phone" label={t("checkout.phone")} error={errors.phone?.message}>
              <input {...input("phone", { autoComplete: "tel", type: "tel", inputMode: "tel" })} />
            </Field>
            <Field
              id="co-email"
              label={t("checkout.email")}
              error={errors.email?.message}
              className="sm:col-span-2"
            >
              <input {...input("email", { autoComplete: "email", type: "email" })} />
            </Field>
            <Field
              id="co-notes"
              label={t("checkout.notes")}
              error={errors.notes?.message}
              className="sm:col-span-2"
            >
              <textarea {...input("notes", { rows: 2, maxLength: 300 })} />
            </Field>
          </div>
        </Step>

        <Step n={4} title={t("checkout.payment")}>
          <div role="radiogroup" aria-label={t("checkout.payment")} className="grid gap-3 sm:grid-cols-2">
            <PayOption
              checked={payment === "store"}
              onSelect={() => setValue("payment", "store")}
              icon={<Store className="size-5" aria-hidden="true" />}
              title={t("checkout.payStore")}
              hint={t("checkout.payStoreHint")}
            />
            <PayOption
              checked={payment === "card"}
              onSelect={() => setValue("payment", "card")}
              icon={<CreditCard className="size-5" aria-hidden="true" />}
              title={t("checkout.payCard")}
              hint={t("checkout.payCardHint")}
            />
          </div>
        </Step>
      </div>

      <div className="grid gap-3 lg:sticky lg:top-[100px]">
        <OrderSummary lines={lines} totals={totals} showDelivery={mode === "delivery"}>
          {blocked ? (
            <p role="status" className="m-0 text-[14px] font-medium text-danger">
              {t("checkout.minimum", { amount: money(totals.belowMinimum) })}
            </p>
          ) : null}
          <Button type="submit" size="lg" className="w-full" disabled={placing || blocked || !now}>
            {placing ? t("checkout.placing") : t("checkout.place", { total: money(totals.total) })}
          </Button>
          <ButtonLink href={ROUTES.menu} variant="quiet" size="sm" className="justify-self-center">
            {t("checkout.edit")}
          </ButtonLink>
        </OrderSummary>
        {tenant.demo.enabled ? <p className="m-0 px-2 text-[13px] text-muted">{t("checkout.demo")}</p> : null}
      </div>
    </form>
  );
}
