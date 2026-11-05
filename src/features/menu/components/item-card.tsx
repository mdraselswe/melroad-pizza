"use client";

import { ArrowUpRight, Plus, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { Tag } from "@/components/ui/tag";
import type { MenuItem } from "@/config/menu-schema";
import { ROUTES } from "@/constants/routes";
import { lineSignature, useAddToCart } from "@/features/cart";
import { PizzaImage } from "@/features/pizza-art";
import { t } from "@/i18n";
import { money } from "@/lib/format";
import { artFor, isPizza, lowestPrice } from "@/lib/menu";
import { useItemSheet } from "../item-sheet-store";
import { canQuickAdd } from "../options";

const ACTION =
  "inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full px-4 text-sm font-semibold no-underline transition-[background,color,transform] active:scale-95";
const ACTION_PRIMARY = `${ACTION} bg-accent text-on-accent hover:brightness-110`;
const ACTION_QUIET = `${ACTION} border border-line text-ink hover:border-accent`;

function Thumb({ item }: { item: MenuItem }) {
  const art = artFor(item);
  if (art && isPizza(item))
    return (
      <span className="pointer-events-none absolute -top-6 -right-6 size-[132px] rotate-[-8deg] [filter:drop-shadow(0_12px_14px_var(--shadow))] transition-transform duration-700 ease-[cubic-bezier(.3,1.3,.5,1)] group-hover:rotate-[14deg]">
        <PizzaImage art={art} px={300} />
      </span>
    );
  return null;
}

function Action({ item }: { item: MenuItem }) {
  const addToCart = useAddToCart();
  const openSheet = useItemSheet((s) => s.open);

  if (isPizza(item))
    return (
      <Link
        href={`${ROUTES.build}?pizza=${item.id}`}
        className={ACTION_PRIMARY}
        aria-label={`${t("menu.build")} ${item.name}`}
      >
        {t("menu.build")}
        <ArrowUpRight className="size-4" aria-hidden="true" />
      </Link>
    );

  if (!canQuickAdd(item))
    return (
      <button
        type="button"
        className={ACTION_QUIET}
        onClick={() => openSheet(item.id)}
        aria-label={`${t("menu.choose")} ${item.name}`}
      >
        <SlidersHorizontal className="size-4" aria-hidden="true" />
        {t("menu.choose")}
      </button>
    );

  return (
    <button
      type="button"
      className={ACTION_PRIMARY}
      aria-label={`${t("menu.add")} ${item.name}`}
      onClick={() =>
        addToCart({
          signature: lineSignature("item", item.id),
          kind: "item",
          refId: item.id,
          name: item.name,
          details: [],
          unitPrice: item.price,
          image: item.image,
        })
      }
    >
      <Plus className="size-4" aria-hidden="true" />
      {t("menu.add")}
    </button>
  );
}

export function ItemCard({ item }: { item: MenuItem }) {
  const pizza = isPizza(item);
  const from = lowestPrice(item);
  const ranged = from !== item.price || item.options.some((g) => g.choices.some((c) => c.price > 0));

  return (
    <article className="glass group relative isolate flex min-h-[188px] flex-col gap-2 overflow-hidden rounded-[var(--radius-card)] p-5 backdrop-blur-none">
      <Thumb item={item} />
      <h3
        className={
          pizza
            ? "m-0 max-w-[calc(100%-110px)] text-lg leading-tight font-bold tracking-[-.02em]"
            : "m-0 text-lg leading-tight font-bold tracking-[-.02em]"
        }
      >
        {item.name}
      </h3>
      {item.description ? (
        <p
          className={
            pizza
              ? "m-0 max-w-[calc(100%-96px)] text-[14.5px] leading-snug text-muted"
              : "m-0 text-[14.5px] leading-snug text-muted"
          }
        >
          {item.description}
        </p>
      ) : null}
      {item.tags.length ? (
        <div className="flex flex-wrap gap-1.5">
          {item.tags.map((tag) => (
            <Tag key={tag} tag={tag} />
          ))}
        </div>
      ) : null}
      <div className="mt-auto flex items-center justify-between gap-3 pt-3">
        <b className="text-xl tracking-[-.03em] tabular-nums">
          {ranged ? t("menu.from", { price: money(from) }) : money(from)}
        </b>
        <Action item={item} />
      </div>
    </article>
  );
}
