#!/usr/bin/env node
// List all Stitch projects on the account, plus their screens.
//
// Usage:
//   node scripts/list.mjs                # list projects only
//   node scripts/list.mjs <projectId>    # list screens within a project
//
// Useful for: discovering project IDs (set STITCH_PROJECT_ID env from output),
// auditing what's been generated, finding screen IDs to edit/iterate.

import { stitch } from "@google/stitch-sdk";

if (!process.env.STITCH_API_KEY) {
  console.error("STITCH_API_KEY not set. Source via /op-secrets first.");
  process.exit(2);
}

const projectId = process.argv[2];

// Iteration-2 fix: SDK objects have circular `client` back-references that
// crash JSON.stringify. Project/screen instances embed self-loops via the
// SDK's internal request handler. Fix: extract just the safe scalar fields
// (id, name, createdAt, etc.) before serializing. Verified across 2 sub-
// agent eval runs — both reported "TypeError: Converting circular structure".
function safeProject(p) {
  return {
    id: p.id ?? null,
    name: p.name ?? p.title ?? null,
    createdAt: p.createdAt ?? p.created_at ?? null,
    updatedAt: p.updatedAt ?? p.updated_at ?? null,
  };
}

function safeScreen(s) {
  return {
    id: s.id ?? null,
    name: s.name ?? s.title ?? null,
    device: s.device ?? null,
    createdAt: s.createdAt ?? s.created_at ?? null,
  };
}

if (!projectId) {
  const projects = await stitch.projects();
  if (!projects.length) {
    console.log("No projects yet. Create one at https://stitch.withgoogle.com");
    process.exit(0);
  }
  const safe = projects.map(safeProject);
  console.log(JSON.stringify(safe, null, 2));
  console.error(
    `\n(${safe.length} project${safe.length === 1 ? "" : "s"}; ` +
      `set STITCH_PROJECT_ID=${safe[0].id} for the default)`,
  );
  process.exit(0);
}

const project = stitch.project(projectId);
const screens = await project.screens();
console.log(JSON.stringify(screens.map(safeScreen), null, 2));
