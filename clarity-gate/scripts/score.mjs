/**
 * Clarity Gate ambiguity scorer.
 * Pure heuristics — no network, no LLM. Fast enough for beforeSubmitPrompt.
 */

const VAGUE_ACTION =
  /\b(fix|improve|clean\s*up|cleanup|refactor|handle|update|optimize|polish|tweak|sort\s*out|look\s*(at|into)|check|review|make\s+(it|this)\s+better|do\s+something|help\s+(me|with)|work\s+on)\b/i;

const SPECIFIC_ACTION =
  /\b(add|create|implement|rename|move|delete|remove|migrate|extract|wire|connect|replace|bump|pin|upgrade|downgrade|write|generate|scaffold|install|uninstall|deploy|revert|merge|split)\b/i;

const SUCCESS_SIGNAL =
  /\b(pass(es|ing)?|green|until|should|must|acceptance|criteria|verify|assert|expect|typecheck|type-check|lint|build|e2e|unit\s+test|integration\s+test|no\s+regress)/i;

const PATH_SIGNAL =
  /(?:^|[\s`"'(])(?:\.?\.?\/|@)?[\w.-]+(?:\/[\w.-]+)+(?:\.\w+)?|[`"'][\w./\\-]+\.\w{1,8}[`"']|\b[\w-]+\.(?:ts|tsx|js|jsx|mjs|cjs|py|go|rs|java|kt|swift|rb|php|css|scss|html|md|json|yml|yaml|toml|sql|sh|ps1)\b/i;

const SCOPE_SIGNAL =
  /\b(only|just|don't|do\s+not|without|no\s+new\s+deps|minimal|smallest|don't\s+touch|leave\s+\w+\s+alone|scope)\b/i;

const RISK_SIGNAL =
  /\b(prod(uction)?|migrat(e|ion)|auth(entication|orization)?|payment|billing|delet(e|ion)|drop\s+table|force\s+push|secrets?|credential|pii|gdpr|public\s+api)\b/i;

const RISK_ACK =
  /\b(dry-?run|careful|safe(ly)?|local\s+only|behind\s+flag|feature\s+flag|rollback|backup|staging|non-prod)\b/i;

const FOLLOW_UP =
  /^(yes|y|yep|yeah|ok|okay|sure|continue|go|go\s+ahead|do\s+it|lgtm|proceed|please|thanks|thank\s+you|thx|no|nope|nah|cancel|stop|wait|nvm|never\s*mind|exactly|correct|right|that'?s\s+(it|right)|ship\s+it)[\s!.]*$/i;

const MULTI_GOAL =
  /\b(and\s+also|also\s+then|plus\s+also|as\s+well\s+as|;|,?\s*then\s+(also\s+)?)\b/i;

const PRONOUN_HEAP =
  /\b(it|this|that|these|those|them|the\s+thing|the\s+stuff|everything)\b/gi;

const CLARITY_BYPASS =
  /^\[clarity\s*:\s*(skip|pass|off|resolved)\]/i;

const CLARITY_PICKS =
  /\[clarity\s*:\s*\d[a-d](?:\s*,\s*\d[a-d]){1,3}\]/i;

const RESOLVED_BLOCK =
  /\[clarity\s*:\s*resolved\][\s\S]*?\b(TARGET|SUCCESS|SCOPE|RISK)\s*:/i;

export function isBypassPrompt(prompt) {
  const text = String(prompt || "").trim();
  if (!text) return true;
  if (CLARITY_BYPASS.test(text)) return true;
  if (CLARITY_PICKS.test(text)) return true;
  if (RESOLVED_BLOCK.test(text)) return true;
  return false;
}

/** True only for a deliberate one-off skip (not a clarified resend). */
export function isSkipPrompt(prompt) {
  return CLARITY_BYPASS.test(String(prompt || "").trim());
}

export function isFollowUp(prompt) {
  const text = String(prompt || "").trim();
  if (text.length > 48) return false;
  return FOLLOW_UP.test(text);
}

function countMatches(re, text) {
  const flags = re.flags.includes("g") ? re.flags : re.flags + "g";
  const copy = new RegExp(re.source, flags);
  return (text.match(copy) || []).length;
}

/**
 * @returns {{ score: number, reasons: string[], missing: string[], signals: object }}
 */
export function scorePrompt(prompt, attachments = []) {
  const text = String(prompt || "").trim();
  const reasons = [];
  const missing = [];
  let score = 0;

  const attachmentCount = Array.isArray(attachments) ? attachments.length : 0;
  const hasPath = PATH_SIGNAL.test(text) || attachmentCount > 0;
  const hasSuccess = SUCCESS_SIGNAL.test(text);
  const hasScope = SCOPE_SIGNAL.test(text);
  const hasRiskWord = RISK_SIGNAL.test(text);
  const hasRiskAck = RISK_ACK.test(text);
  const vague = VAGUE_ACTION.test(text);
  const specific = SPECIFIC_ACTION.test(text);
  const multi = MULTI_GOAL.test(text);
  const pronouns = countMatches(PRONOUN_HEAP, text);

  if (!text) {
    return {
      score: 100,
      reasons: ["Empty prompt"],
      missing: ["target", "success", "scope"],
      signals: {},
    };
  }

  // Short vague asks are expensive in Agent mode
  if (text.length < 24 && vague) {
    score += 28;
    reasons.push("Very short vague request");
  } else if (text.length < 40 && !hasPath && !specific) {
    score += 18;
    reasons.push("Short prompt with little concrete detail");
  }

  if (vague && !specific) {
    score += 22;
    reasons.push("Vague action verb (fix/improve/handle/...)");
  } else if (vague && specific) {
    score += 8;
    reasons.push("Mix of vague and specific verbs");
  }

  if (!hasPath) {
    score += 20;
    reasons.push("No file/path/@ reference");
    missing.push("target");
  } else {
    score -= 10;
  }

  if (!hasSuccess) {
    score += 14;
    reasons.push("No success / done criteria");
    missing.push("success");
  } else {
    score -= 8;
  }

  if (!hasScope) {
    score += 10;
    reasons.push("No scope boundary");
    missing.push("scope");
  } else {
    score -= 6;
  }

  if (hasRiskWord && !hasRiskAck) {
    score += 16;
    reasons.push("High-risk topic without safety acknowledgment");
    missing.push("risk");
  }

  if (multi) {
    score += 12;
    reasons.push("Multiple competing goals in one prompt");
  }

  if (pronouns >= 3 && !hasPath) {
    score += 10;
    reasons.push("Many pronouns without a clear referent");
  }

  // Numbered steps / acceptance lists are clarity gold
  if (/(?:^|\n)\s*(?:[-*]|\d+[.)])\s+\S+/m.test(text)) {
    score -= 12;
    reasons.push("Structured list/steps present (−)");
  }

  if (attachmentCount > 0) {
    score -= 8;
    reasons.push(`${attachmentCount} attachment(s) (−)`);
  }

  // Clamp
  score = Math.max(0, Math.min(100, Math.round(score)));

  // Deduplicate missing
  const uniqMissing = [...new Set(missing)];

  return {
    score,
    reasons: reasons.filter((r) => !r.endsWith("(−)") || score > 0),
    missing: uniqMissing,
    signals: {
      hasPath,
      hasSuccess,
      hasScope,
      hasRiskWord,
      hasRiskAck,
      vague,
      specific,
      multi,
      pronouns,
      attachmentCount,
      length: text.length,
    },
  };
}

export function buildResolveBoard(analysis, prompt) {
  const need = new Set(analysis.missing.length ? analysis.missing : ["target", "success", "scope"]);

  const questions = [];

  if (need.has("target")) {
    questions.push({
      id: 1,
      key: "TARGET",
      prompt: "Where should the agent work?",
      options: [
        { id: "a", label: "Current / attached files only" },
        { id: "b", label: "Name specific paths (add them in your reply)" },
        { id: "c", label: "Whole repo / discover as needed" },
      ],
    });
  }

  if (need.has("success")) {
    questions.push({
      id: 2,
      key: "SUCCESS",
      prompt: "What counts as done?",
      options: [
        { id: "a", label: "Code change only" },
        { id: "b", label: "Tests / typecheck / lint must pass" },
        { id: "c", label: "PR-ready (tests + short summary)" },
      ],
    });
  }

  if (need.has("scope")) {
    questions.push({
      id: 3,
      key: "SCOPE",
      prompt: "How wide can the change be?",
      options: [
        { id: "a", label: "Minimal diff — smallest fix" },
        { id: "b", label: "Refactor OK inside touched area" },
        { id: "c", label: "Broader cleanup OK" },
      ],
    });
  }

  if (need.has("risk") || analysis.signals.hasRiskWord) {
    questions.push({
      id: 4,
      key: "RISK",
      prompt: "Risk posture?",
      options: [
        { id: "a", label: "Local / safe only" },
        { id: "b", label: "Shared code OK, no prod actions" },
        { id: "c", label: "Prod-sensitive — be extra careful" },
      ],
    });
  }

  // Always at least 2 questions for a useful board
  if (questions.length < 2) {
    if (!questions.find((q) => q.key === "SUCCESS")) {
      questions.push({
        id: 2,
        key: "SUCCESS",
        prompt: "What counts as done?",
        options: [
          { id: "a", label: "Code change only" },
          { id: "b", label: "Tests / typecheck / lint must pass" },
          { id: "c", label: "PR-ready (tests + short summary)" },
        ],
      });
    }
    if (!questions.find((q) => q.key === "SCOPE")) {
      questions.push({
        id: 3,
        key: "SCOPE",
        prompt: "How wide can the change be?",
        options: [
          { id: "a", label: "Minimal diff — smallest fix" },
          { id: "b", label: "Refactor OK inside touched area" },
          { id: "c", label: "Broader cleanup OK" },
        ],
      });
    }
  }

  // Renumber ids sequentially for compact picks
  questions.forEach((q, i) => {
    q.id = i + 1;
  });

  return {
    createdAt: new Date().toISOString(),
    score: analysis.score,
    reasons: analysis.reasons,
    missing: analysis.missing,
    originalPrompt: prompt,
    questions,
  };
}

/** Short popup text — Cursor shows this as a toast/popup, not a window. */
export function formatPopupMessage(board, tokensSaved) {
  const demo = board.questions.map((q) => `${q.id}a`).join(",");
  const why = board.reasons.slice(0, 2).join("; ");
  const saved = Number(tokensSaved) > 0
    ? `Saved ~${Number(tokensSaved).toLocaleString("en-US")} tokens of likely rework.`
    : null;
  return [
    `Clarity Gate blocked this (ambiguity ${board.score}/100).`,
    `Open: .cursor/clarity-gate/RESOLVE_BOARD.md`,
    `Or resend: [clarity:${demo}] ${summarizePrompt(board.originalPrompt)}`,
    `Why: ${why}`,
    saved,
    `Bypass once: [clarity:skip]`,
  ]
    .filter(Boolean)
    .join("\n");
}

/** Full board written to RESOLVE_BOARD.md for the editor. */
export function formatBoardMarkdown(board) {
  const lines = [];
  lines.push(`# Clarity Gate - Resolve Board`);
  lines.push("");
  lines.push(`Ambiguity score: **${board.score}/100**`);
  lines.push("");
  lines.push("Pick one letter per question, then **resend** your Agent prompt.");
  lines.push("");

  for (const q of board.questions) {
    lines.push(`## ${q.id}. ${q.key}: ${q.prompt}`);
    for (const opt of q.options) {
      lines.push(`- **[${opt.id}]** ${opt.label}`);
    }
    lines.push("");
  }

  const demo = board.questions.map((q) => `${q.id}a`).join(",");
  lines.push("## Fastest resend");
  lines.push("");
  lines.push("```text");
  lines.push(`[clarity:${demo}] ${summarizePrompt(board.originalPrompt)}`);
  lines.push("```");
  lines.push("");
  lines.push("## Full form");
  lines.push("");
  lines.push("```text");
  lines.push("[clarity:resolved]");
  for (const q of board.questions) {
    lines.push(`${q.key}: <your pick>`);
  }
  lines.push("---");
  lines.push(summarizePrompt(board.originalPrompt));
  lines.push("```");
  lines.push("");
  lines.push("Bypass once with `[clarity:skip]` · turn off with `/clarity-off`");
  lines.push("");
  lines.push("### Why blocked");
  for (const r of board.reasons.slice(0, 6)) {
    lines.push(`- ${r}`);
  }
  lines.push("");
  return lines.join("\n");
}

/** @deprecated use formatPopupMessage — kept for tests */
export function formatUserMessage(board) {
  return formatBoardMarkdown(board);
}

function summarizePrompt(prompt) {
  const t = String(prompt || "").replace(/\s+/g, " ").trim();
  if (t.length <= 160) return t;
  return t.slice(0, 157) + "...";
}

export function shouldGateMode(composerMode, state) {
  const mode = String(composerMode || "agent").toLowerCase();
  const allowed = Array.isArray(state.modes) ? state.modes.map((m) => String(m).toLowerCase()) : ["agent"];
  // Gate Agent by default; Ask/chat pass through unless configured
  return allowed.includes(mode) || (allowed.includes("agent") && mode === "agent");
}
