#!/usr/bin/env node
import fs from "node:fs";
import {
  estimateUsd,
  lastBoardPath,
  readState,
  readStats,
  statePath,
} from "./lib.mjs";

const root = process.argv[2] || process.env.CURSOR_PROJECT_DIR || process.cwd();
const state = readState(root);
const boardFile = lastBoardPath(root);
const stats = readStats(root);
const t = stats.totals || {};

console.log("Clarity Gate status");
console.log(`  root:      ${root}`);
console.log(`  enabled:   ${state.enabled}`);
console.log(`  threshold: ${state.threshold}`);
console.log(`  modes:     ${(state.modes || []).join(", ")}`);
console.log(`  state:     ${statePath(root)}`);
if (fs.existsSync(boardFile)) {
  const board = JSON.parse(fs.readFileSync(boardFile, "utf8"));
  console.log(`  last score:${board.score}`);
  console.log(`  last board:${boardFile}`);
} else {
  console.log("  last board:(none)");
}

const rate = Number.isFinite(state.usdPerMillionTokens) ? state.usdPerMillionTokens : 6;
const usd = estimateUsd(t.tokensSaved, rate);
console.log("  --- ROI ---");
console.log(`  blocked:   ${t.blocked || 0}`);
console.log(`  saved:     ~${(t.tokensSaved || 0).toLocaleString("en-US")} tokens (~$${usd.toFixed(2)})`);
console.log("  details:   /clarity-roi");
