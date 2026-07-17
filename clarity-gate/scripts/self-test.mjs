#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  scorePrompt,
  isBypassPrompt,
  isSkipPrompt,
  isFollowUp,
  buildResolveBoard,
  formatPopupMessage,
  formatBoardMarkdown,
} from "./score.mjs";
import {
  estimateTokensSaved,
  estimateUsd,
  readStats,
  recordGateEvent,
  renderRoiReport,
} from "./lib.mjs";

function expectBlock(prompt, min = 45) {
  const a = scorePrompt(prompt);
  assert.ok(a.score >= min, `expected block for "${prompt}" score=${a.score}`);
}

function expectPass(prompt, max = 44) {
  const a = scorePrompt(prompt);
  assert.ok(a.score <= max, `expected pass for "${prompt}" score=${a.score}`);
}

expectBlock("fix it");
expectBlock("improve the auth");
expectBlock("clean this up and also make it faster");
expectBlock("handle the payment stuff in production");

expectPass(
  "In src/auth/session.ts, fix refresh token rotation. Keep the diff minimal. Unit tests in src/auth/session.test.ts must pass."
);
expectPass(
  "add retry to packages/api/src/client.ts until unit tests pass — only touch that file"
);

assert.equal(isBypassPrompt("[clarity:skip] explore"), true);
assert.equal(isBypassPrompt("[clarity:1b,2b,3a] task"), true);
assert.equal(isSkipPrompt("[clarity:skip] explore"), true);
assert.equal(isSkipPrompt("[clarity:1b,2b,3a] task"), false, "picks are a resolve, not a skip");
assert.equal(isFollowUp("yes"), true);
assert.equal(isFollowUp("continue"), true);
assert.equal(isFollowUp("fix everything please now"), false);

const board = buildResolveBoard(scorePrompt("fix it"), "fix it");
const popup = formatPopupMessage(board, 15000);
const md = formatBoardMarkdown(board);
assert.ok(popup.includes("Clarity Gate blocked"));
assert.ok(popup.includes("RESOLVE_BOARD.md"));
assert.ok(popup.includes("15,000 tokens"), "popup shows tokens saved");
assert.ok(md.includes("Resolve Board"));
assert.ok(md.includes("[clarity:"));

// --- ROI estimator ---
const high = estimateTokensSaved({ score: 94, missing: ["target", "success", "scope"] });
const low = estimateTokensSaved({ score: 20, missing: ["scope"] });
assert.ok(high > low, "more ambiguous prompts save more");
assert.ok(high > 10000 && high < 30000, `high estimate sane, got ${high}`);
assert.equal(estimateTokensSaved({ score: 0, missing: [] }), 0);
assert.ok(Math.abs(estimateUsd(1_000_000, 6) - 6) < 1e-9, "usd math");

// --- stats persistence + report ---
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "clarity-roi-"));
recordGateEvent(tmp, "blocked", { score: 94, tokensSaved: high });
recordGateEvent(tmp, "resolved", { score: 94 });
recordGateEvent(tmp, "bypassed", { score: 60 });
recordGateEvent(tmp, "passed", { score: 10 });
const s = readStats(tmp);
assert.equal(s.totals.blocked, 1);
assert.equal(s.totals.resolved, 1);
assert.equal(s.totals.bypassed, 1);
assert.equal(s.totals.passed, 1);
assert.equal(s.totals.prompts, 4);
assert.equal(s.totals.tokensSaved, high);
const report = renderRoiReport(s, { usdPerMillionTokens: 6 });
assert.ok(report.includes("Clarity Gate - ROI"));
assert.ok(report.includes("tokens** saved"));
assert.ok(report.includes("50%"), "comply rate = 1 resolved / (1 resolved + 1 bypassed)");
fs.rmSync(tmp, { recursive: true, force: true });

console.log("clarity-gate self-test: OK");
