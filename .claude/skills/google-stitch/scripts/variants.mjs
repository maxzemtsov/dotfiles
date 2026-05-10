#!/usr/bin/env node
// Generate N variants of an existing screen (explore design space).
//
// Usage:
//   node scripts/variants.mjs <screenId> "<variant direction>" [count=3]
//
// Saves each variant as .stitch/designs/variant-<n>-<id>.{html,png}.
// Outputs JSON array of { screenId, htmlPath, imagePath } for downstream tools.

import { stitch } from "@google/stitch-sdk";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

const [, , screenId, direction, countArg] = process.argv;
const count = parseInt(countArg || "3", 10);

if (!screenId || !direction) {
  console.error(
    "usage: node scripts/variants.mjs <screenId> \"<direction>\" [count]",
  );
  process.exit(2);
}
if (!process.env.STITCH_API_KEY) {
  console.error("STITCH_API_KEY not set. Source via /op-secrets first.");
  process.exit(2);
}

const projectId =
  process.env.STITCH_PROJECT_ID || (await stitch.projects())[0]?.id;
const project = stitch.project(projectId);
const screen = await project.getScreen(screenId);
const variants = await screen.variants(direction, { count });

const out = [];
let i = 0;
for (const v of variants) {
  const htmlUrl = await v.getHtml();
  const imageUrl = await v.getImage();
  const outDir = process.env.STITCH_OUTPUT_DIR || ".stitch/designs";
  const htmlPath = `${outDir}/variant-${i}-${v.id}.html`;
  const imagePath = `${outDir}/variant-${i}-${v.id}.png`;
  await mkdir(dirname(htmlPath), { recursive: true });
  const htmlBody = await fetch(htmlUrl).then((r) => r.text());
  const imageBuf = Buffer.from(await fetch(imageUrl).then((r) => r.arrayBuffer()));
  await writeFile(htmlPath, htmlBody);
  await writeFile(imagePath, imageBuf);
  out.push({ screenId: v.id, htmlPath, imagePath });
  i++;
}
console.log(JSON.stringify(out, null, 2));
