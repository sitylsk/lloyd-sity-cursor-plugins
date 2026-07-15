#!/usr/bin/env node
import { readLedger, writeReport, summarize } from "./lib.mjs";
const root = process.argv[2] || process.env.CURSOR_PROJECT_DIR || process.cwd();
const ledger = readLedger(root);
const path = writeReport(root, ledger);
const s = summarize(ledger);
console.log(`Report written: ${path}`);
console.log(`Verdict: ${s.mixture} (dominant ${s.dominant})`);
console.log(JSON.stringify(s.byEdits));
