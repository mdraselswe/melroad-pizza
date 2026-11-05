/** Stable signature for merging identical cart lines: same kind, item and options in any order. */
export function lineSignature(kind: string, refId: string, parts: Record<string, unknown> = {}): string {
  const normalised = Object.keys(parts)
    .sort()
    .map((k) => {
      const v = parts[k];
      return `${k}=${Array.isArray(v) ? [...v].map(String).sort().join("+") : String(v ?? "")}`;
    })
    .join("&");
  return `${kind}:${refId}${normalised ? `?${normalised}` : ""}`;
}
