#!/usr/bin/env node
import { readLedger, readState, summarize, reportPath, writeReport } from "./lib.mjs";
const root = process.argv[2] || process.env.CURSOR_PROJECT_DIR || process.cwd();
const state = readState(root);
const ledger = readLedger(root);
const s = summarize(ledger);
const path = writeReport(root, ledger);
console.log("Build Origin status");
console.log(`  enabled:  ${state.enabled}`);
console.log(`  mixture:  ${s.mixture}`);
console.log(`  dominant: ${s.dominant}`);
console.log(`  edits:    ${s.totalEdits}`);
console.log(`  split:    desktop ${s.byEdits.desktop}% | mobile ${s.byEdits.mobile}% | cloud ${s.byEdits.cloud}% | web ${s.byEdits.web}%`);
console.log(`  report:   ${path}`);
