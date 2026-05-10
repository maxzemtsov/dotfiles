#!/usr/bin/env node
// Generate a UI screen via Google Stitch SDK + save HTML + screenshot to disk.
//
// Usage:
//   node scripts/generate.mjs "<enhanced prompt>" [DESKTOP|MOBILE|TABLET|AGNOSTIC] [output-name]
//
// Environment:
//   STITCH_API_KEY      required (resolve via /op-secrets — see SKILL.md auth)
//   STITCH_PROJECT_ID   optional; defaults to first project on account
//
// Output:
//   <STITCH_OUTPUT_DIR or .stitch/designs>/<output-name>.html   rendered HTML
//   <STITCH_OUTPUT_DIR or .stitch/designs>/<output-name>.png    screenshot
//   stdout: JSON { screenId, htmlPath, imagePath }
//
// Iteration-2 fix: STITCH_OUTPUT_DIR env var lets callers override the
// hardcoded `.stitch/designs/` path without copying files post-generation.
// Useful for QA harnesses, eval suites, and embedding in larger flows.
//
// Why a script (not inline cat-heredoc): the same generate-then-save pattern
// repeats across every Stitch call. Bundling means one source of truth for
// error handling, output paths, and project resolution.

import { stitch } from "@google/stitch-sdk";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

const [, , prompt, deviceArg, nameArg] = process.argv;
const device = (deviceArg || "DESKTOP").toUpperCase();
const name = nameArg || `screen-${Date.now()}`;

if (!prompt) {
  console.error("usage: node scripts/generate.mjs \"<prompt>\" [DEVICE] [name]");
  process.exit(2);
}
if (!process.env.STITCH_API_KEY) {
  console.error("STITCH_API_KEY not set. Source via /op-secrets first.");
  process.exit(2);
}

const validDevices = new Set(["DESKTOP", "MOBILE", "TABLET", "AGNOSTIC"]);
if (!validDevices.has(device)) {
  console.error(`device must be one of ${[...validDevices].join("|")}, got: ${device}`);
  process.exit(2);
}

let projectId = process.env.STITCH_PROJECT_ID;
if (!projectId) {
  const projects = await stitch.projects();
  if (!projects.length) {
    console.error("No Stitch projects on this account. Create one at https://stitch.withgoogle.com");
    process.exit(1);
  }
  projectId = projects[0].id;
  console.error(`(STITCH_PROJECT_ID unset — using first project: ${projectId})`);
}

const project = stitch.project(projectId);
const screen = await project.generate(prompt, device);

const html = await screen.getHtml();
const image = await screen.getImage();

const outDir = process.env.STITCH_OUTPUT_DIR || ".stitch/designs";
const htmlPath = `${outDir}/${name}.html`;
const imagePath = `${outDir}/${name}.png`;
await mkdir(dirname(htmlPath), { recursive: true });

// html + image are URLs that Stitch hosts; download them.
const htmlBody = await fetch(html).then((r) => r.text());
const imageBuf = Buffer.from(await fetch(image).then((r) => r.arrayBuffer()));
await writeFile(htmlPath, htmlBody);
await writeFile(imagePath, imageBuf);

console.log(JSON.stringify({ screenId: screen.id, htmlPath, imagePath, projectId }, null, 2));
