#!/usr/bin/env node
/**
 * Optional: register Clarity Gate as a project-level hook with an absolute path.
 * Use when plugin-local hooks don't fire in your Cursor build.
 *
 * Usage: node scripts/register-project-hook.mjs [workspace-root]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pluginRoot = path.resolve(__dirname, "..");
const scriptPath = path.join(pluginRoot, "scripts", "before-submit.mjs");
const workspace = path.resolve(process.argv[2] || process.cwd());
const cursorDir = path.join(workspace, ".cursor");
const hooksFile = path.join(cursorDir, "hooks.json");

fs.mkdirSync(cursorDir, { recursive: true });

let existing = { version: 1, hooks: {} };
if (fs.existsSync(hooksFile)) {
  try {
    existing = JSON.parse(fs.readFileSync(hooksFile, "utf8"));
  } catch {
    existing = { version: 1, hooks: {} };
  }
}

existing.version = existing.version || 1;
existing.hooks = existing.hooks || {};
const list = Array.isArray(existing.hooks.beforeSubmitPrompt)
  ? existing.hooks.beforeSubmitPrompt
  : [];

const command = `node "${scriptPath.replace(/\\/g, "/")}"`;
const filtered = list.filter((h) => !String(h.command || "").includes("clarity-gate"));
filtered.push({ command, timeout: 8 });
existing.hooks.beforeSubmitPrompt = filtered;

fs.writeFileSync(hooksFile, JSON.stringify(existing, null, 2) + "\n", "utf8");
console.log(`Registered Clarity Gate project hook in ${hooksFile}`);
console.log(`Command: ${command}`);
