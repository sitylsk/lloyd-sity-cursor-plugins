import fs from "node:fs";
import path from "node:path";

export const DEFAULT_STATE = {
  enabled: true,
  threshold: 45,
  modes: ["agent"],
  allowFollowUps: true,
  version: 1,
};

export function projectRoot(payload = {}) {
  const roots = payload.workspace_roots;
  if (Array.isArray(roots) && roots.length > 0) return roots[0];
  return process.env.CURSOR_PROJECT_DIR || process.cwd();
}

export function stateDir(root) {
  return path.join(root, ".cursor", "clarity-gate");
}

export function statePath(root) {
  return path.join(stateDir(root), "state.json");
}

export function lastBoardPath(root) {
  return path.join(stateDir(root), "last-board.json");
}

export function resolveBoardMdPath(root) {
  return path.join(stateDir(root), "RESOLVE_BOARD.md");
}

export function debugLogPath(root) {
  return path.join(stateDir(root), "debug.log");
}

export function appendDebug(root, line) {
  try {
    ensureStateDir(root);
    const stamp = new Date().toISOString();
    fs.appendFileSync(debugLogPath(root), `[${stamp}] ${line}\n`, "utf8");
  } catch {
    // ignore
  }
}

export function ensureStateDir(root) {
  fs.mkdirSync(stateDir(root), { recursive: true });
}

export function readState(root) {
  const file = statePath(root);
  if (!fs.existsSync(file)) return { ...DEFAULT_STATE };
  try {
    const raw = JSON.parse(fs.readFileSync(file, "utf8"));
    return { ...DEFAULT_STATE, ...raw };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

export function writeState(root, patch) {
  ensureStateDir(root);
  const next = { ...readState(root), ...patch, updatedAt: new Date().toISOString() };
  fs.writeFileSync(statePath(root), JSON.stringify(next, null, 2) + "\n", "utf8");
  return next;
}

export function writeLastBoard(root, board) {
  ensureStateDir(root);
  fs.writeFileSync(lastBoardPath(root), JSON.stringify(board, null, 2) + "\n", "utf8");
}

export function writeResolveBoardMd(root, markdown) {
  ensureStateDir(root);
  fs.writeFileSync(resolveBoardMdPath(root), markdown, "utf8");
}

export function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (c) => chunks.push(c));
    process.stdin.on("end", () => resolve(chunks.join("")));
    process.stdin.on("error", reject);
  });
}

export function emit(obj) {
  process.stdout.write(JSON.stringify(obj) + "\n");
}
