/**
 * Next 16 static export on Windows writes prefetch segment files as
 * `menu/__next.menu/__PAGE__.txt` (it only converts "/" to "."), but the
 * client requests `menu/__next.menu.__PAGE__.txt`. Flatten them so local
 * Windows builds prefetch like Linux/CI builds do. No-op elsewhere.
 */
import { readdirSync, renameSync, rmdirSync, statSync } from "node:fs";
import path from "node:path";

const OUT = path.resolve("out");
let moved = 0;

function flatten(dir, prefix, target) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    const flat = `${prefix}.${name}`;
    if (statSync(full).isDirectory()) flatten(full, flat, target);
    else {
      renameSync(full, path.join(target, flat));
      moved++;
    }
  }
  rmdirSync(dir);
}

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (!statSync(full).isDirectory()) continue;
    if (name.startsWith("__next.")) flatten(full, name, dir);
    else if (name !== "_next") walk(full);
  }
}

try {
  walk(OUT);
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
if (moved)
  process.stdout.write(`fix-export-segments: flattened ${moved} prefetch file(s)
`);
