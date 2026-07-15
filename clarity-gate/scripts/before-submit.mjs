#!/usr/bin/env node
/**
 * Clarity Gate — beforeSubmitPrompt hook
 * Blocks ambiguous Agent prompts and shows a Resolve Board.
 */
import {
  appendDebug,
  emit,
  projectRoot,
  readState,
  readStdin,
  writeLastBoard,
  writeResolveBoardMd,
} from "./lib.mjs";
import {
  buildResolveBoard,
  formatBoardMarkdown,
  formatPopupMessage,
  isBypassPrompt,
  isFollowUp,
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
    appendDebug(root, "allow: bypass tag");
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
    emit({ continue: true });
    return;
  }

  const board = buildResolveBoard(analysis, prompt);
  try {
    writeLastBoard(root, board);
    writeResolveBoardMd(root, formatBoardMarkdown(board));
  } catch (err) {
    appendDebug(root, `write-board-fail: ${err?.message || err}`);
  }

  appendDebug(root, `BLOCK score=${analysis.score}`);
  emit({
    continue: false,
    user_message: formatPopupMessage(board),
  });
}

main().catch((err) => {
  console.error("[clarity-gate]", err?.message || err);
  emit({ continue: true });
});
