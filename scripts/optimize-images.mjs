// Convert raster images under public/images/** to compressed WebP.
//
// Editors can simply drop a .jpg/.jpeg/.png/.tif into public/images/people or
// public/images/events and run `npm run images:webp` (or let the GitHub Action
// do it). Each original is resized down to a sensible max width, re-encoded as
// WebP, and the original is removed so only WebP ends up committed.
//
// Reference it in content by the .webp name, e.g. `photo: alex-rivers.webp`.

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.join(process.cwd(), "public", "images");
const RASTER = new Set([".jpg", ".jpeg", ".png", ".tif", ".tiff"]);
const MAX_WIDTH = 1600; // plenty for full-width photos on this site
const QUALITY = 82;

/** Recursively list every file under a directory. */
function walk(dir) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  return entries.flatMap((e) => {
    const full = path.join(dir, e.name);
    return e.isDirectory() ? walk(full) : [full];
  });
}

async function convert(file) {
  const ext = path.extname(file).toLowerCase();
  if (!RASTER.has(ext)) return false;

  const target = file.slice(0, -ext.length) + ".webp";
  const image = sharp(file, { failOn: "none" });
  const meta = await image.metadata();

  const pipeline =
    meta.width && meta.width > MAX_WIDTH
      ? image.resize({ width: MAX_WIDTH })
      : image;

  await pipeline.webp({ quality: QUALITY }).toFile(target);
  fs.unlinkSync(file);

  const rel = path.relative(process.cwd(), file);
  const relTarget = path.relative(process.cwd(), target);
  console.log(`  ${rel}  ->  ${relTarget}`);
  return true;
}

async function main() {
  const files = walk(ROOT);
  let count = 0;
  for (const file of files) {
    if (await convert(file)) count += 1;
  }
  console.log(
    count > 0
      ? `Converted ${count} image${count === 1 ? "" : "s"} to WebP.`
      : "No raster images to convert — everything is already WebP.",
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
