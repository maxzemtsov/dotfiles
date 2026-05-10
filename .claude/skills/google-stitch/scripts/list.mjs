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

if (!projectId) {
  const projects = await stitch.projects();
  if (!projects.length) {
    console.log("No projects yet. Create one at https://stitch.withgoogle.com");
    process.exit(0);
  }
  console.log(JSON.stringify(projects, null, 2));
  console.error(
    `\n(${projects.length} project${projects.length === 1 ? "" : "s"}; ` +
      `set STITCH_PROJECT_ID=${projects[0].id} for the default)`,
  );
  process.exit(0);
}

const project = stitch.project(projectId);
const screens = await project.screens();
console.log(JSON.stringify(screens, null, 2));
