#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  detectPlatform,
  recordEdit,
  readLedger,
  summarize,
  writeState,
  renderReport,
} from "./lib.mjs";

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "build-origin-"));
writeState(tmp, { enabled: true });

assert.equal(detectPlatform({}, { BUILD_ORIGIN_FORCE: "mobile" }), "mobile");
assert.equal(detectPlatform({ source: "iosApp" }, {}), "mobile");
assert.equal(detectPlatform({}, { CURSOR_CODE_REMOTE: "true", CURSOR_AGENT: "1" }), "cloud");
assert.equal(detectPlatform({}, {}), "desktop");

recordEdit(tmp, "desktop", path.join(tmp, "src/app.ts"), [
  { old_string: "a", new_string: "a\nb\nc" },
]);
recordEdit(tmp, "mobile", path.join(tmp, "src/ui.tsx"), [
  { old_string: "", new_string: "export const X = 1\n" },
]);
recordEdit(tmp, "mobile", path.join(tmp, "src/ui.tsx"), [
  { old_string: "export const X = 1\n", new_string: "export const X = 2\n" },
]);

const ledger = readLedger(tmp);
const s = summarize(ledger);
assert.ok(ledger.totals.desktop.edits >= 1);
assert.ok(ledger.totals.mobile.edits >= 2);
assert.equal(s.mixture, "mixed");
assert.ok(renderReport(ledger).includes("Lloyd Sity"));
assert.ok(fs.existsSync(path.join(tmp, "BUILD_ORIGIN.md")));

console.log("build-origin self-test: OK");
console.log(`tmp=${tmp} mixture=${s.mixture}`);
