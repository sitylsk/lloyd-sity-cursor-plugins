import fs from "node:fs";
import path from "node:path";

export const DEFAULT_STATE = {
  enabled: true,
  threshold: 45,
  modes: ["agent"],
  allowFollowUps: true,
  version: 1,
  // Rough blended price used only for the human-readable $ estimate in the ROI report.
  // Tokens are the source of truth; adjust to your model's real rate.
  usdPerMillionTokens: 6,
};

export const DEFAULT_STATS = {
  version: 1,
  createdAt: null,
  updatedAt: null,
  totals: {
    prompts: 0, // gated-mode prompts seen
    blocked: 0,
    passed: 0,
    resolved: 0, // resent with clarity picks after a recent block
    bypassed: 0, // [clarity:skip]
    tokensSaved: 0, // estimated, conservative
  },
  lastBlockAt: null,
  recent: [],
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

export function statsPath(root) {
  return path.join(stateDir(root), "stats.json");
}

export function roiReportPath(root) {
  return path.join(stateDir(root), "CLARITY_ROI.md");
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

/* ---------------------------------------------------------------------------
 * ROI tracking
 * Every block records a conservative estimate of the tokens a vague Agent turn
 * would have burned (exploration + a likely-wrong first attempt + rework).
 * Tokens are the honest unit; the $ figure in the report is clearly labeled
 * as an estimate derived from `usdPerMillionTokens`.
 * ------------------------------------------------------------------------- */

export function readStats(root) {
  const file = statsPath(root);
  if (!fs.existsSync(file)) return structuredCloneStats(DEFAULT_STATS);
  try {
    const raw = JSON.parse(fs.readFileSync(file, "utf8"));
    const base = structuredCloneStats(DEFAULT_STATS);
    return {
      ...base,
      ...raw,
      totals: { ...base.totals, ...(raw.totals || {}) },
      recent: Array.isArray(raw.recent) ? raw.recent : [],
    };
  } catch {
    return structuredCloneStats(DEFAULT_STATS);
  }
}

function structuredCloneStats(s) {
  return {
    ...s,
    totals: { ...s.totals },
    recent: [...s.recent],
  };
}

/**
 * Conservative estimate of tokens a vague Agent turn would have wasted.
 * Scales with ambiguity score and how many key fields are missing.
 * @param {{score:number, missing?:string[]}} analysis
 */
export function estimateTokensSaved(analysis) {
  const score = Math.max(0, Math.min(100, Number(analysis?.score) || 0));
  const missing = Array.isArray(analysis?.missing) ? analysis.missing.length : 0;
  // Baseline: an ambiguous Agent prompt tends to trigger repo exploration
  // (file reads + searches) before it can even start — call it ~6k tokens.
  const baseExploration = 6000;
  // Each missing dimension (target/success/scope/risk) raises the odds of a
  // wrong first attempt + a correction round-trip. ~3.5k tokens each.
  const perMissing = 3500;
  const raw = (baseExploration + perMissing * missing) * (score / 100);
  return Math.round(raw);
}

/**
 * Record a gate event and persist stats. Fail-open: never throws.
 * @param {string} root
 * @param {"blocked"|"passed"|"resolved"|"bypassed"} action
 * @param {{score?:number, tokensSaved?:number, prompt?:string}} [info]
 */
export function recordGateEvent(root, action, info = {}) {
  try {
    ensureStateDir(root);
    const stats = readStats(root);
    const now = new Date().toISOString();
    if (!stats.createdAt) stats.createdAt = now;
    stats.updatedAt = now;

    stats.totals.prompts += 1;
    if (action === "blocked") {
      stats.totals.blocked += 1;
      stats.totals.tokensSaved += Number(info.tokensSaved) || 0;
      stats.lastBlockAt = now;
    } else if (action === "passed") {
      stats.totals.passed += 1;
    } else if (action === "resolved") {
      stats.totals.resolved += 1;
    } else if (action === "bypassed") {
      stats.totals.bypassed += 1;
    }

    stats.recent = [
      {
        at: now,
        action,
        score: Number.isFinite(info.score) ? info.score : null,
        tokensSaved: Number(info.tokensSaved) || 0,
      },
      ...stats.recent,
    ].slice(0, 50);

    fs.writeFileSync(statsPath(root), JSON.stringify(stats, null, 2) + "\n", "utf8");
    return stats;
  } catch {
    return null;
  }
}

/** Was there a block recently enough that this resend counts as a resolve? */
export function hadRecentBlock(root, withinMs = 30 * 60 * 1000) {
  const stats = readStats(root);
  if (!stats.lastBlockAt) return false;
  const t = Date.parse(stats.lastBlockAt);
  if (!Number.isFinite(t)) return false;
  return Date.now() - t <= withinMs;
}

function fmtInt(n) {
  return Number(n || 0).toLocaleString("en-US");
}

export function estimateUsd(tokens, usdPerMillion) {
  const rate = Number(usdPerMillion) || 0;
  return (Number(tokens || 0) / 1_000_000) * rate;
}

/** Render the GitHub-friendly ROI report. */
export function renderRoiReport(stats, state = {}) {
  const t = stats.totals || {};
  const rate = Number.isFinite(state.usdPerMillionTokens)
    ? state.usdPerMillionTokens
    : DEFAULT_STATE.usdPerMillionTokens;
  const usd = estimateUsd(t.tokensSaved, rate);
  const decided = (t.resolved || 0) + (t.bypassed || 0);
  const complyRate = decided > 0 ? Math.round(((t.resolved || 0) / decided) * 100) : null;

  const lines = [];
  lines.push("# Clarity Gate - ROI");
  lines.push("");
  lines.push("Tracked by **Clarity Gate** · Creator: **Lloyd Sity**");
  lines.push("");
  lines.push(`Last updated: ${stats.updatedAt || new Date().toISOString()}`);
  lines.push("");
  lines.push("## Bottom line");
  lines.push("");
  lines.push(`- **~${fmtInt(t.tokensSaved)} tokens** saved (estimated)`);
  lines.push(`- **~$${usd.toFixed(2)}** at $${rate}/1M tokens (rough, configurable)`);
  lines.push(`- **${fmtInt(t.blocked)}** vague prompts stopped before they ran`);
  if (complyRate !== null) {
    lines.push(`- **${complyRate}%** of stopped prompts were clarified & resent (vs bypassed)`);
  }
  lines.push("");
  lines.push("## Counters");
  lines.push("");
  lines.push("| Metric | Count |");
  lines.push("|---|---:|");
  lines.push(`| Prompts seen (gated modes) | ${fmtInt(t.prompts)} |`);
  lines.push(`| Blocked | ${fmtInt(t.blocked)} |`);
  lines.push(`| Passed straight through | ${fmtInt(t.passed)} |`);
  lines.push(`| Clarified & resent | ${fmtInt(t.resolved)} |`);
  lines.push(`| Bypassed (\`[clarity:skip]\`) | ${fmtInt(t.bypassed)} |`);
  lines.push(`| Est. tokens saved | ${fmtInt(t.tokensSaved)} |`);
  lines.push("");
  lines.push("## How the estimate works (honest)");
  lines.push("");
  lines.push("Each block assumes a vague Agent turn would have burned roughly");
  lines.push("`6k` tokens of exploration plus `~3.5k` per missing dimension");
  lines.push("(target / success / scope / risk), scaled by the ambiguity score.");
  lines.push("It is deliberately conservative and counts only prevented waste,");
  lines.push("not the follow-up correction turns you also avoid.");
  lines.push("");
  lines.push("_Tokens are the source of truth; the $ figure is an estimate._");
  lines.push("");
  return lines.join("\n");
}

export function writeRoiReport(root, stats, state) {
  ensureStateDir(root);
  fs.writeFileSync(roiReportPath(root), renderRoiReport(stats, state), "utf8");
  return roiReportPath(root);
}
