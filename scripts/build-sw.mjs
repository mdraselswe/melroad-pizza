/**
 * Writes `out/sw.js`: a service worker that precaches the whole static export
 * so the site opens and works offline after the first visit.
 *
 * The precache list and version come from the files in `out/`, so every build
 * ships a new worker and old caches are dropped. Runs after `next build`.
 */
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const OUT = path.resolve("out");
const TEMPLATE = path.resolve("scripts/sw.template.js");
/** Not needed offline (or must never be cached). */
const SKIP = new Set(["sw.js", "robots.txt", "sitemap.xml", "404.html"]);
/** Error pages answer 404, which would fail the whole precache. */
const SKIP_DIRS = ["404/", "_not-found/"];

function files(dir, base = "") {
  return readdirSync(dir).flatMap((name) => {
    const rel = base ? `${base}/${name}` : name;
    const full = path.join(dir, name);
    return statSync(full).isDirectory() ? files(full, rel) : [rel];
  });
}

/** File path in `out/` → the URL the browser requests (trailing-slash routes). */
export function urlFor(rel) {
  if (rel === "index.html") return "/";
  if (rel.endsWith("/index.html")) return `/${rel.slice(0, -"index.html".length)}`;
  return `/${rel}`;
}

const all = files(OUT).filter((rel) => !SKIP.has(rel) && !SKIP_DIRS.some((d) => rel.startsWith(d)));
const urls = all.map(urlFor).sort();

const hash = createHash("sha256");
for (const rel of all.sort()) hash.update(rel).update(readFileSync(path.join(OUT, rel)));
const version = hash.digest("hex").slice(0, 12);

const sw = readFileSync(TEMPLATE, "utf8")
  .replace("__VERSION__", version)
  .replace("__PRECACHE__", JSON.stringify(urls));
writeFileSync(path.join(OUT, "sw.js"), sw);
process.stdout.write(`build-sw: ${urls.length} files precached (version ${version})\n`);
