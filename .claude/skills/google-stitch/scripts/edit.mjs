#!/usr/bin/env node
// Edit an existing Stitch screen by id (refine instead of regenerate).
//
// Usage:
//   node scripts/edit.mjs <screenId> "<edit prompt>" [output-name]
//
// Editing is preferred over regenerating because Stitch preserves design-system
// continuity (colors, spacing, fonts) across edits. Each regenerate starts fresh
// and burns a generation slot from your monthly quota.

import { stitch } from "@google/stitch-sdk";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

const [, , screenId, editPrompt, nameArg] = process.argv;
const name = nameArg || `edited-${Date.now()}`;

if (!screenId || !editPrompt) {
  console.error("usage: node scripts/edit.mjs <screenId> \"<edit prompt>\" [name]");
  process.exit(2);
}
if (!process.env.STITCH_API_KEY) {
  console.error("STITCH_API_KEY not set. Source via /op-secrets first.");
  process.exit(2);
}

const projectId =
  process.env.STITCH_PROJECT_ID || (await stitch.projects())[0]?.id;
if (!projectId) {
  console.error("No project resolved. Set STITCH_PROJECT_ID or create a project.");
  process.exit(1);
}

const project = stitch.project(projectId);
const screen = await project.getScreen(screenId);
const edited = await screen.edit(editPrompt);

const htmlUrl = await edited.getHtml();
const imageUrl = await edited.getImage();

const htmlPath = `.stitch/designs/${name}.html`;
const imagePath = `.stitch/designs/${name}.png`;
await mkdir(dirname(htmlPath), { recursive: true });

const htmlBody = await fetch(htmlUrl).then((r) => r.text());
const imageBuf = Buffer.from(await fetch(imageUrl).then((r) => r.arrayBuffer()));
await writeFile(htmlPath, htmlBody);
await writeFile(imagePath, imageBuf);

console.log(
  JSON.stringify(
    { screenId: edited.id, basedOn: screenId, htmlPath, imagePath, projectId },
    null,
    2,
  ),
);
