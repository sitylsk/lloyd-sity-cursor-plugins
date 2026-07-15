#!/usr/bin/env node
import { PLATFORMS, projectRoot, readSession, writeSession, writeState, readState } from "./lib.mjs";

const platform = String(process.argv[2] || "").toLowerCase();
const root = process.argv[3] || process.env.CURSOR_PROJECT_DIR || process.cwd();

if (!PLATFORMS.includes(platform) || platform === "unknown") {
  console.error("Usage: node origin-as.mjs <desktop|mobile|cloud|web> [workspace]");
  process.exit(1);
}

const state = readState(root);
if (!state.enabled) writeState(root, { enabled: true });

const prev = readSession(root) || {};
writeSession(root, {
  ...prev,
  platform,
  force: true,
  startedAt: prev.startedAt || new Date().toISOString(),
  taggedAt: new Date().toISOString(),
});
process.env.BUILD_ORIGIN_FORCE = platform;
console.log(`Session origin forced to: ${platform}`);
console.log("Edits in this session will count toward that platform.");
