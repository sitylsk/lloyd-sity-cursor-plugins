import fs from "node:fs";
import path from "node:path";
import os from "node:os";

export const PLATFORMS = ["desktop", "mobile", "cloud", "web", "unknown"];

export const DEFAULT_STATE = {
  enabled: true,
  version: 1,
  autoCommitReport: false,
};

export function projectRoot(payload = {}) {
  const roots = payload.workspace_roots;
  if (Array.isArray(roots) && roots.length > 0) return roots[0];
  return process.env.CURSOR_PROJECT_DIR || process.cwd();
}

export function originDir(root) {
  return path.join(root, ".cursor", "build-origin");
}

export function statePath(root) {
  return path.join(originDir(root), "state.json");
}

export function ledgerPath(root) {
  return path.join(originDir(root), "ledger.json");
}

export function sessionPath(root) {
  return path.join(originDir(root), "session.json");
}

export function reportPath(root) {
  return path.join(root, "BUILD_ORIGIN.md");
}

export function ensureDir(root) {
  fs.mkdirSync(originDir(root), { recursive: true });
}

export function readState(root) {
  const file = statePath(root);
  if (!fs.existsSync(file)) return { ...DEFAULT_STATE };
  try {
    return { ...DEFAULT_STATE, ...JSON.parse(fs.readFileSync(file, "utf8")) };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

export function writeState(root, patch) {
  ensureDir(root);
  const next = { ...readState(root), ...patch, updatedAt: new Date().toISOString() };
  fs.writeFileSync(statePath(root), JSON.stringify(next, null, 2) + "\n", "utf8");
  return next;
}

export function emptyLedger() {
  return {
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    totals: {
      desktop: { edits: 0, linesAdded: 0, linesRemoved: 0, sessions: 0, files: {} },
      mobile: { edits: 0, linesAdded: 0, linesRemoved: 0, sessions: 0, files: {} },
      cloud: { edits: 0, linesAdded: 0, linesRemoved: 0, sessions: 0, files: {} },
      web: { edits: 0, linesAdded: 0, linesRemoved: 0, sessions: 0, files: {} },
      unknown: { edits: 0, linesAdded: 0, linesRemoved: 0, sessions: 0, files: {} },
    },
    features: {},
    recent: [],
  };
}

export function readLedger(root) {
  const file = ledgerPath(root);
  if (!fs.existsSync(file)) return emptyLedger();
  try {
    const raw = JSON.parse(fs.readFileSync(file, "utf8"));
    return { ...emptyLedger(), ...raw, totals: { ...emptyLedger().totals, ...(raw.totals || {}) } };
  } catch {
    return emptyLedger();
  }
}

export function writeLedger(root, ledger) {
  ensureDir(root);
  ledger.updatedAt = new Date().toISOString();
  fs.writeFileSync(ledgerPath(root), JSON.stringify(ledger, null, 2) + "\n", "utf8");
}

export function readSession(root) {
  const file = sessionPath(root);
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

export function writeSession(root, session) {
  ensureDir(root);
  fs.writeFileSync(sessionPath(root), JSON.stringify(session, null, 2) + "\n", "utf8");
}

/**
 * Detect where the current Cursor client is driving work from.
 * Honest: mobile is not always exposed by Cursor hooks — use /origin-as when needed.
 */
export function detectPlatform(payload = {}, env = process.env) {
  const forced =
    env.BUILD_ORIGIN_FORCE ||
    env.BUILD_ORIGIN_PLATFORM ||
    payload.force_platform ||
    null;
  if (forced && PLATFORMS.includes(String(forced).toLowerCase())) {
    return String(forced).toLowerCase();
  }

  const candidates = [
    payload.source,
    payload.client,
    payload.client_type,
    payload.clientType,
    payload.origin,
    payload.app,
    payload.surface,
    env.CURSOR_CLIENT,
    env.CURSOR_SOURCE,
    env.CURSOR_APP,
    env.CURSOR_SURFACE,
  ]
    .filter(Boolean)
    .map((v) => String(v).toLowerCase());

  for (const c of candidates) {
    if (/(ios|android|mobile|iphone|ipad)/.test(c)) return "mobile";
    if (/(web|browser|agents\.cursor|pwa)/.test(c)) return "web";
    if (/(cloud|background)/.test(c)) return "cloud";
    if (/(desktop|electron|ide)/.test(c)) return "desktop";
  }

  // Remote Control / cloud agent signals
  if (env.CURSOR_REMOTE_CONTROL === "true" || /remote.?control/i.test(JSON.stringify(payload))) {
    return "mobile";
  }
  if (payload.is_background_agent === true || env.CURSOR_AGENT === "1") {
    if (env.CURSOR_CODE_REMOTE === "true") return "cloud";
  }
  if (env.CURSOR_CODE_REMOTE === "true") return "cloud";

  // Default local IDE
  if (["win32", "darwin", "linux"].includes(process.platform)) {
    return "desktop";
  }
  return "unknown";
}

function lineCount(text) {
  if (!text) return 0;
  const s = String(text);
  // Count logical lines; trailing newline does not add an extra empty line
  const parts = s.split("\n");
  if (parts.length > 1 && parts[parts.length - 1] === "") parts.pop();
  return Math.max(parts.length, s.length ? 1 : 0);
}

/** Stable line-work estimate from Agent/Tab edit hunks. */
export function countEditLines(edits = []) {
  let added = 0;
  let removed = 0;
  for (const e of edits) {
    const oldLen = lineCount(e.old_string);
    const newLen = lineCount(e.new_string);
    if (newLen > oldLen) {
      added += newLen - oldLen;
    } else if (oldLen > newLen) {
      removed += oldLen - newLen;
    } else if (oldLen > 0 && e.old_string !== e.new_string) {
      // Same line count, content changed — count as one line replaced
      added += 1;
      removed += 1;
    } else if (!e.old_string && e.new_string) {
      added += newLen || 1;
    }
  }
  if (added === 0 && removed === 0 && edits.length > 0) {
    added = edits.length;
  }
  return { added, removed };
}

export function featureBucket(filePath) {
  const p = String(filePath || "").replace(/\\/g, "/").toLowerCase();
  if (!p) return "other";
  if (/(^|\/)(test|tests|__tests__|spec)(\/|\.|$)/.test(p) || /\.(test|spec)\./.test(p)) return "tests";
  if (/(^|\/)(docs?|documentation)(\/|$)/.test(p) || /\.mdx?$/.test(p)) return "docs";
  if (/(^|\/)(\.github|ci|workflows)(\/|$)/.test(p)) return "ci";
  if (/(^|\/)(infra|deploy|terraform|k8s|helm)(\/|$)/.test(p)) return "infra";
  if (/(^|\/)(app|apps|web|frontend|ui|components|pages|views)(\/|$)/.test(p) || /\.(tsx|jsx|css|scss|vue|svelte)$/.test(p)) return "frontend";
  if (/(^|\/)(api|server|backend|services|workers)(\/|$)/.test(p)) return "backend";
  if (/\.(ts|js|mjs|cjs|py|go|rs|java|kt|rb|php)$/.test(p)) return "app-code";
  if (/(package\.json|pnpm-lock|cargo\.toml|go\.mod|requirements)/.test(p)) return "deps";
  return "other";
}

export function relativeFile(root, absPath) {
  try {
    return path.relative(root, absPath).replace(/\\/g, "/") || absPath;
  } catch {
    return absPath;
  }
}

export function percent(part, whole) {
  if (!whole) return 0;
  return Math.round((part / whole) * 1000) / 10;
}

export function summarize(ledger) {
  const edits = {};
  let totalEdits = 0;
  let totalLines = 0;
  for (const p of PLATFORMS) {
    const t = ledger.totals[p] || { edits: 0, linesAdded: 0, linesRemoved: 0 };
    const lineWork = (t.linesAdded || 0) + (t.linesRemoved || 0);
    edits[p] = t.edits || 0;
    totalEdits += t.edits || 0;
    totalLines += lineWork;
  }
  const byEdits = {};
  const byLines = {};
  for (const p of PLATFORMS) {
    const t = ledger.totals[p] || { edits: 0, linesAdded: 0, linesRemoved: 0 };
    byEdits[p] = percent(t.edits || 0, totalEdits);
    byLines[p] = percent((t.linesAdded || 0) + (t.linesRemoved || 0), totalLines);
  }
  const dominant = PLATFORMS.filter((p) => p !== "unknown").sort(
    (a, b) => (ledger.totals[b]?.edits || 0) - (ledger.totals[a]?.edits || 0)
  )[0];
  let mixture = "unknown";
  const meaningful = PLATFORMS.filter((p) => p !== "unknown" && (ledger.totals[p]?.edits || 0) > 0);
  if (meaningful.length === 0) mixture = "none-yet";
  else if (meaningful.length === 1) mixture = meaningful[0] + "-only";
  else mixture = "mixed";

  return { totalEdits, totalLines, byEdits, byLines, dominant, mixture, meaningful };
}

export function renderReport(ledger, meta = {}) {
  const s = summarize(ledger);
  const lines = [];
  lines.push("# Build Origin");
  lines.push("");
  lines.push(`Tracked by **Build Origin** · Creator: **Lloyd Sity**`);
  lines.push("");
  lines.push(`Last updated: ${ledger.updatedAt || new Date().toISOString()}`);
  lines.push("");
  lines.push(`## Verdict: \`${s.mixture}\``);
  lines.push("");
  if (s.mixture === "none-yet") {
    lines.push("_No tracked edits yet. Keep Build Origin on and work in Agent/Tab._");
  } else if (s.mixture.endsWith("-only")) {
    lines.push(`This project looks **${s.dominant}-only** so far (${s.byEdits[s.dominant]}% of edits).`);
  } else {
    lines.push(`This project is a **mixture** of platforms. Dominant: **${s.dominant}** (${s.byEdits[s.dominant]}% of edits).`);
  }
  lines.push("");
  lines.push("## Platform split (by edits)");
  lines.push("");
  lines.push("| Platform | Edits | % edits | Lines +/- | % line-work | Sessions |");
  lines.push("|---|---:|---:|---:|---:|---:|");
  for (const p of PLATFORMS) {
    const t = ledger.totals[p] || {};
    if (!(t.edits || t.sessions)) continue;
    const lw = (t.linesAdded || 0) + (t.linesRemoved || 0);
    lines.push(
      `| ${p} | ${t.edits || 0} | ${s.byEdits[p]}% | +${t.linesAdded || 0} / -${t.linesRemoved || 0} (${lw}) | ${s.byLines[p]}% | ${t.sessions || 0} |`
    );
  }
  lines.push("");
  lines.push("## Features / areas");
  lines.push("");
  const feats = Object.entries(ledger.features || {}).sort((a, b) => (b[1].edits || 0) - (a[1].edits || 0));
  if (!feats.length) {
    lines.push("_No feature buckets yet._");
  } else {
    lines.push("| Area | Edits | Desktop | Mobile | Cloud | Web | Unknown |");
    lines.push("|---|---:|---:|---:|---:|---:|---:|");
    for (const [name, f] of feats.slice(0, 40)) {
      lines.push(
        `| ${name} | ${f.edits || 0} | ${f.desktop || 0} | ${f.mobile || 0} | ${f.cloud || 0} | ${f.web || 0} | ${f.unknown || 0} |`
      );
    }
  }
  lines.push("");
  lines.push("## How to read this");
  lines.push("");
  lines.push("- **desktop** — Cursor desktop IDE on a computer");
  lines.push("- **mobile** — Cursor iOS / Android (or Remote Control from phone), when tagged or detected");
  lines.push("- **cloud** — Cursor Cloud Agent VM");
  lines.push("- **web** — cursor.com/agents in a browser");
  lines.push("- Cursor does not always expose mobile vs desktop to hooks; use `/origin-as mobile` (or desktop/cloud/web) at session start for accuracy.");
  lines.push("");
  lines.push("## Controls");
  lines.push("");
  lines.push("- `/build-origin-on` · `/build-origin-off` · `/build-origin-status` · `/build-origin-report`");
  lines.push("- `/origin-as <desktop|mobile|cloud|web>` — force platform for this session");
  lines.push("");
  lines.push(`Host: ${os.hostname()} · Generator: build-origin@1.0.0`);
  if (meta.note) {
    lines.push("");
    lines.push(meta.note);
  }
  lines.push("");
  return lines.join("\n");
}

export function writeReport(root, ledger) {
  const md = renderReport(ledger);
  fs.writeFileSync(reportPath(root), md, "utf8");
  return reportPath(root);
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

export function recordEdit(root, platform, filePath, edits) {
  const ledger = readLedger(root);
  const { added, removed } = countEditLines(edits);
  const rel = relativeFile(root, filePath);
  const bucket = featureBucket(rel);
  const t = ledger.totals[platform] || ledger.totals.unknown;
  t.edits = (t.edits || 0) + 1;
  t.linesAdded = (t.linesAdded || 0) + added;
  t.linesRemoved = (t.linesRemoved || 0) + removed;
  t.files = t.files || {};
  t.files[rel] = (t.files[rel] || 0) + 1;
  ledger.totals[platform] = t;

  ledger.features[bucket] = ledger.features[bucket] || {
    edits: 0,
    desktop: 0,
    mobile: 0,
    cloud: 0,
    web: 0,
    unknown: 0,
  };
  ledger.features[bucket].edits += 1;
  ledger.features[bucket][platform] = (ledger.features[bucket][platform] || 0) + 1;

  ledger.recent = [
    {
      at: new Date().toISOString(),
      platform,
      file: rel,
      feature: bucket,
      linesAdded: added,
      linesRemoved: removed,
    },
    ...(ledger.recent || []),
  ].slice(0, 100);

  writeLedger(root, ledger);
  writeReport(root, ledger);
  return { platform, rel, bucket, added, removed, ledger };
}
