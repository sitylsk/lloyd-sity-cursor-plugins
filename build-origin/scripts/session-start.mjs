#!/usr/bin/env node
import {
  detectPlatform,
  emit,
  projectRoot,
  readSession,
  readState,
  readStdin,
  writeSession,
  writeLedger,
  readLedger,
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

  const existing = readSession(root);
  const platform =
    (existing && existing.force) || detectPlatform(payload, process.env);

  const session = {
    sessionId: payload.session_id || payload.conversation_id || null,
    platform,
    force: Boolean(existing?.force),
    startedAt: new Date().toISOString(),
    isBackground: Boolean(payload.is_background_agent),
    composerMode: payload.composer_mode || null,
  };
  writeSession(root, session);

  // Count session once per new session id
  const ledger = readLedger(root);
  const seenKey = `session:${session.sessionId || "anon"}`;
  ledger._seenSessions = ledger._seenSessions || {};
  if (session.sessionId && !ledger._seenSessions[seenKey]) {
    ledger._seenSessions[seenKey] = session.platform;
    ledger.totals[session.platform].sessions =
      (ledger.totals[session.platform].sessions || 0) + 1;
    writeLedger(root, ledger);
  }

  emit({
    env: {
      BUILD_ORIGIN_PLATFORM: platform,
    },
    additional_context: `Build Origin is ON. This session is tagged as platform=${platform}. Override with /origin-as mobile|desktop|cloud|web. Turn off with /build-origin-off.`,
  });
}

main().catch(() => emit({}));
