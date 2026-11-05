// Converts source photos in design/photos-src/*.jpg into small WebP files in
// public/images/menu/. Run with `npm run images` after adding a photo.
import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = path.resolve("design/photos-src");
const OUT = path.resolve("public/images/menu");
const SIZE = 640;

await mkdir(OUT, { recursive: true });
const files = (await readdir(SRC)).filter((f) => /\.(jpe?g|png)$/i.test(f));

for (const file of files) {
  const out = path.join(OUT, file.replace(/\.(jpe?g|png)$/i, ".webp"));
  const info = await sharp(path.join(SRC, file))
    .resize(SIZE, SIZE, { fit: "cover" })
    .webp({ quality: 74, effort: 6 })
    .toFile(out);
  console.warn(`${file} → ${path.relative(process.cwd(), out)} (${Math.round(info.size / 1024)} KB)`);
}
