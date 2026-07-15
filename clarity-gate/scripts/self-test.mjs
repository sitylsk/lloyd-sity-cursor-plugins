#!/usr/bin/env node
import assert from "node:assert/strict";
import {
  scorePrompt,
  isBypassPrompt,
  isFollowUp,
  buildResolveBoard,
  formatPopupMessage,
  formatBoardMarkdown,
} from "./score.mjs";

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
assert.equal(isFollowUp("yes"), true);
assert.equal(isFollowUp("continue"), true);
assert.equal(isFollowUp("fix everything please now"), false);

const board = buildResolveBoard(scorePrompt("fix it"), "fix it");
const popup = formatPopupMessage(board);
const md = formatBoardMarkdown(board);
assert.ok(popup.includes("Clarity Gate blocked"));
assert.ok(popup.includes("RESOLVE_BOARD.md"));
assert.ok(md.includes("Resolve Board"));
assert.ok(md.includes("[clarity:"));

console.log("clarity-gate self-test: OK");
