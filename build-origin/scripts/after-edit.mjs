#!/usr/bin/env node
import {
  detectPlatform,
  emit,
  projectRoot,
  readSession,
  readState,
  readStdin,
  recordEdit,
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

  const session = readSession(root);
  const platform =
    process.env.BUILD_ORIGIN_PLATFORM ||
    session?.platform ||
    detectPlatform(payload, process.env);

  const filePath = payload.file_path || payload.path || "";
  const edits = payload.edits || [];
  if (!filePath) {
    emit({});
    return;
  }

  // Skip tracking our own report churn
  if (/BUILD_ORIGIN\.md$/i.test(filePath) || /[\\/]\.cursor[\\/]build-origin[\\/]/i.test(filePath)) {
    emit({});
    return;
  }

  recordEdit(root, platform, filePath, edits);
  emit({});
}

main().catch(() => emit({}));
