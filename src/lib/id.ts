const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

/** Short, unambiguous, human-friendly reference such as "MR-7K2QX". */
export function orderReference(prefix: string, random: () => number = Math.random): string {
  let code = "";
  for (let i = 0; i < 5; i++) code += ALPHABET[Math.floor(random() * ALPHABET.length)];
  return `${prefix}-${code}`;
}

/** Unique id for list keys and cart lines. */
export function uid(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
