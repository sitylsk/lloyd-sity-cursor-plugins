#!/usr/bin/env node
import {
  emit,
  projectRoot,
  readLedger,
  readState,
  readStdin,
  writeReport,
  summarize,
} from "./lib.mjs";

async function main() {
  let payload = {};
  try {
    const raw = await readStdin();
    if (raw.trim()) payload = JSON.parse(raw);
  } catch {
    emit({});
    return;
  }

  const root = projectRoot(payload);
  const state = readState(root);
  if (!state.enabled) {
    emit({});
    return;
  }

  const ledger = readLedger(root);
  writeReport(root, ledger);
  const s = summarize(ledger);
  // Non-intrusive: no followup_message spam
  emit({});
  if (process.env.BUILD_ORIGIN_DEBUG) {
    console.error(`[build-origin] stop mixture=${s.mixture} edits=${s.totalEdits}`);
  }
}

main().catch(() => emit({}));
