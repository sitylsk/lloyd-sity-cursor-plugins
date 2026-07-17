#!/usr/bin/env node
/**
 * Clarity Gate — /clarity-roi
 * Prints the estimated ROI (tokens/$ saved, blocks, comply rate) and
 * (re)writes .cursor/clarity-gate/CLARITY_ROI.md so it's visible on GitHub.
 */
import {
  estimateUsd,
  projectRoot,
  readState,
  readStats,
  roiReportPath,
  writeRoiReport,
} from "./lib.mjs";

const root = process.argv[2] || process.env.CURSOR_PROJECT_DIR || process.cwd();
const state = readState(root);
const stats = readStats(root);
const t = stats.totals || {};

const rate = Number.isFinite(state.usdPerMillionTokens) ? state.usdPerMillionTokens : 6;
const usd = estimateUsd(t.tokensSaved, rate);
const decided = (t.resolved || 0) + (t.bypassed || 0);
const complyRate = decided > 0 ? Math.round(((t.resolved || 0) / decided) * 100) : null;

let reportFile = roiReportPath(root);
try {
  reportFile = writeRoiReport(root, stats, state);
} catch {
  // fail-open
}

console.log("Clarity Gate ROI");
console.log(`  root:            ${root}`);
console.log(`  prompts seen:    ${t.prompts || 0}`);
console.log(`  blocked:         ${t.blocked || 0}`);
console.log(`  passed:          ${t.passed || 0}`);
console.log(`  clarified/resent:${t.resolved || 0}`);
console.log(`  bypassed (skip): ${t.bypassed || 0}`);
console.log(`  est tokens saved:~${(t.tokensSaved || 0).toLocaleString("en-US")}`);
console.log(`  est $ saved:     ~$${usd.toFixed(2)} (@ $${rate}/1M)`);
if (complyRate !== null) console.log(`  comply rate:     ${complyRate}%`);
console.log(`  report:          ${reportFile}`);
