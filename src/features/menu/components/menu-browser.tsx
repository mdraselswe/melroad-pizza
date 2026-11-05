"use client";

import { Search, X } from "lucide-react";
import { useDeferredValue, useEffect, useRef, useState } from "react";
import { menu } from "@/config/tenant";
import { useScrollSpy } from "@/hooks/use-scroll-spy";
import { t } from "@/i18n";
import { cn } from "@/lib/cn";
import { groupMenu } from "../search";
import { ItemCard } from "./item-card";

const sectionId = (categoryId: string) => `cat-${categoryId}`;

function CategoryNav({ ids, active }: { ids: { id: string; name: string }[]; active?: string }) {
  const listRef = useRef<HTMLDivElement>(null);

  // Keep the active chip visible as the page scrolls.
  useEffect(() => {
    const list = listRef.current;
    const chip = list?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    if (!list || !chip) return;
    list.scrollTo({
      left: chip.offsetLeft - list.clientWidth / 2 + chip.clientWidth / 2,
      behavior: "smooth",
    });
  }, [active]);

  return (
    <nav
      aria-label={t("menu.categories")}
      className="sticky top-[calc(env(safe-area-inset-top,0px)+90px)] z-30 min-w-0 rounded-full border border-line bg-[color-mix(in_oklab,var(--bg)_86%,transparent)] p-1.5 shadow-[0_10px_30px_-18px_var(--shadow)] backdrop-blur-xl"
    >
      <div ref={listRef} className="no-scrollbar marquee-mask flex gap-1 overflow-x-auto">
        {ids.map(({ id, name }) => {
          const on = active === sectionId(id);
          return (
            <a
              key={id}
              data-id={sectionId(id)}
              href={`#${sectionId(id)}`}
              aria-current={on ? "true" : undefined}
              className={cn(
                "inline-flex h-9 shrink-0 items-center rounded-full px-4 text-sm font-semibold whitespace-nowrap no-underline transition-colors",
                on ? "bg-accent text-on-accent" : "text-muted hover:text-ink",
              )}
            >
              {name}
            </a>
          );
        })}
      </div>
    </nav>
  );
}

export function MenuBrowser() {
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query);
  const sections = groupMenu(menu.categories, menu.items, deferred);
  const ids = sections.map((s) => ({ id: s.category.id, name: s.category.name }));
  const active = useScrollSpy(ids.map((c) => sectionId(c.id)));
  const count = sections.reduce((n, s) => n + s.items.length, 0);

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-8">
      <div className="flex flex-wrap items-center gap-3">
        <label className="field relative flex h-12 min-w-0 flex-1 items-center gap-2.5 rounded-full px-4 sm:max-w-[420px]">
          <Search className="size-[18px] shrink-0 text-muted" aria-hidden="true" />
          <span className="sr-only">{t("menu.search")}</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("menu.search")}
            className="h-full min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted [&::-webkit-search-cancel-button]:hidden"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label={t("menu.clear")}
              className="grid size-7 place-items-center rounded-full text-muted hover:bg-faint hover:text-ink"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          ) : null}
        </label>
        {deferred ? (
          <span role="status" className="text-sm text-muted">
            {t("menu.results", { count })}
          </span>
        ) : null}
      </div>

      {sections.length ? (
        <>
          <CategoryNav ids={ids} active={active} />
          {sections.map(({ category, items }) => (
            <section
              key={category.id}
              id={sectionId(category.id)}
              className="scroll-mt-[160px]"
              aria-labelledby={`${sectionId(category.id)}-h`}
            >
              <div className="mb-4 flex items-baseline justify-between gap-4">
                <h2
                  id={`${sectionId(category.id)}-h`}
                  className="m-0 text-[28px] font-bold tracking-[-.03em]"
                >
                  {category.name}
                </h2>
                {category.description ? (
                  <p className="m-0 text-sm text-muted max-sm:hidden">{category.description}</p>
                ) : null}
              </div>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-3.5">
                {items.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          ))}
        </>
      ) : (
        <p className="m-0 py-16 text-center text-lg text-muted">{t("menu.noResults", { query: deferred })}</p>
      )}
    </div>
  );
}
