import type { MenuItem, OptionGroup } from "@/config/menu-schema";
import type { OptionSelections } from "@/lib/pricing";

/** Required single-choice groups start on their first choice, so most items are one tap to add. */
export function defaultSelections(item: MenuItem): OptionSelections {
  return Object.fromEntries(
    item.options.map((g) => [g.id, g.min === 1 && g.max === 1 ? [g.choices[0]!.id] : []]),
  );
}

/** Radio behaviour for single-choice groups, capped checkboxes otherwise. */
export function toggleChoice(
  selections: OptionSelections,
  group: OptionGroup,
  choiceId: string,
): OptionSelections {
  const current = selections[group.id] ?? [];
  if (group.max === 1)
    return { ...selections, [group.id]: current[0] === choiceId && group.min === 0 ? [] : [choiceId] };
  if (current.includes(choiceId))
    return { ...selections, [group.id]: current.filter((id) => id !== choiceId) };
  if (current.length >= group.max) return selections;
  return { ...selections, [group.id]: [...current, choiceId] };
}

/** "Chicken", "Garlic, Chilli" — for cart line details. */
export function describeSelections(item: MenuItem, selections: OptionSelections): string[] {
  return item.options.flatMap((g) => {
    const labels = (selections[g.id] ?? [])
      .map((id) => g.choices.find((c) => c.id === id)?.label)
      .filter(Boolean);
    return labels.length ? [labels.join(", ")] : [];
  });
}

export const canQuickAdd = (item: MenuItem) =>
  item.options.every((g) => g.min === 0 || (g.min === 1 && g.max === 1));
