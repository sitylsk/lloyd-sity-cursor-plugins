#!/usr/bin/env node
/**
 * Clarity Gate — beforeSubmitPrompt hook
 * Blocks ambiguous Agent prompts and shows a Resolve Board.
 */
import {
  appendDebug,
  emit,
  estimateTokensSaved,
  hadRecentBlock,
  projectRoot,
  readState,
  readStdin,
  recordGateEvent,
  writeLastBoard,
  writeResolveBoardMd,
  writeRoiReport,
} from "./lib.mjs";
import {
  buildResolveBoard,
  formatBoardMarkdown,
  formatPopupMessage,
  isBypassPrompt,
  isFollowUp,
  isSkipPrompt,
  scorePrompt,
  shouldGateMode,
} from "./score.mjs";

async function main() {
  let payload = {};
  try {
    const raw = await readStdin();
    if (raw.trim()) payload = JSON.parse(raw);
  } catch (err) {
    appendDebug(process.cwd(), `stdin-parse-fail: ${err?.message || err}`);
    emit({ continue: true });
    return;
  }

  const root = projectRoot(payload);
  const state = readState(root);
  const prompt = payload.prompt ?? "";
  const attachments = payload.attachments ?? [];
  const composerMode = payload.composer_mode ?? payload.mode ?? "agent";

  appendDebug(
    root,
    `hit mode=${composerMode} enabled=${state.enabled} prompt="${String(prompt).slice(0, 80).replace(/\n/g, " ")}"`
  );

  if (!state.enabled) {
    appendDebug(root, "allow: disabled");
    emit({ continue: true });
    return;
  }

  if (!shouldGateMode(composerMode, state)) {
    appendDebug(root, `allow: mode ${composerMode} not gated`);
    emit({ continue: true });
    return;
  }

  if (isBypassPrompt(prompt)) {
    // A resend right after a block = the user clarified (a win we should credit).
    // A raw [clarity:skip] = deliberate bypass (gate overhead we should own).
    const skip = isSkipPrompt(prompt);
    if (skip) {
      appendDebug(root, "allow: bypass skip");
      recordAndReport(root, state, "bypassed");
    } else {
      const resolved = hadRecentBlock(root);
      appendDebug(root, `allow: clarity picks resolved=${resolved}`);
      recordAndReport(root, state, resolved ? "resolved" : "passed");
    }
    emit({ continue: true });
    return;
  }

  if (state.allowFollowUps !== false && isFollowUp(prompt)) {
    appendDebug(root, "allow: follow-up");
    emit({ continue: true });
    return;
  }

  const analysis = scorePrompt(prompt, attachments);
  const threshold = Number.isFinite(state.threshold) ? state.threshold : 45;

  if (analysis.score < threshold) {
    appendDebug(root, `allow: score ${analysis.score} < ${threshold}`);
    recordAndReport(root, state, "passed", { score: analysis.score });
    emit({ continue: true });
    return;
  }

  const board = buildResolveBoard(analysis, prompt);
  const tokensSaved = estimateTokensSaved(analysis);
  try {
    writeLastBoard(root, board);
    writeResolveBoardMd(root, formatBoardMarkdown(board));
  } catch (err) {
    appendDebug(root, `write-board-fail: ${err?.message || err}`);
  }

  recordAndReport(root, state, "blocked", { score: analysis.score, tokensSaved });

  appendDebug(root, `BLOCK score=${analysis.score} tokensSaved~=${tokensSaved}`);
  emit({
    continue: false,
    user_message: formatPopupMessage(board, tokensSaved),
  });
}

function recordAndReport(root, state, action, info = {}) {
  try {
    const stats = recordGateEvent(root, action, info);
    if (stats) writeRoiReport(root, stats, state);
  } catch (err) {
    appendDebug(root, `roi-record-fail: ${err?.message || err}`);
  }
}

main().catch((err) => {
  console.error("[clarity-gate]", err?.message || err);
  emit({ continue: true });
});
