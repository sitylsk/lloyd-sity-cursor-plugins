---
name: validate-and-submit-plugin
description: >-
  Pre-submission checklist for a Cursor marketplace plugin. Use when the user
  is ready to publish, import to a team, or wants a validation pass against
  the official template and the target repo’s conventions.
---

# Validate and submit plugin

Run a checklist before public publish or team import. Do not invent emails or secrets.

## When to use

- “Is this plugin ready to submit?”
- Before [cursor.com/marketplace/publish](https://cursor.com/marketplace/publish)
- Team Marketplace import of a GitHub repo

## Steps

1. **If the repo has a validator, run it.** The official [plugin template](https://github.com/cursor/plugin-template) ships `node scripts/validate-template.mjs`. This marketplace repo does **not** include that script — if the user’s repo also lacks it, use the manual list below.
2. Manual checklist (from the official template README plus marketplace conventions):
   - [ ] Each plugin has a valid `.cursor-plugin/plugin.json`
   - [ ] Plugin names are unique, lowercase, kebab-case
   - [ ] Marketplace `plugins[].source` maps to a real folder **from the repo root** (in this marketplace repo: `"clarity-gate"`, `"build-origin"`, `"grok-plugin-maker"` — not `plugins/…`; template-style repos use `./plugins/<name>`)
   - [ ] Marketplace entry `name` matches that plugin’s `plugin.json` `name`
   - [ ] `author.name` is present on `plugin.json` and, when registered, on the marketplace entry — **the same publisher name/org on both**. Do not require a specific person; do not invent a name or email.
   - [ ] Rules have frontmatter `description`; skills/agents/commands have `name` + `description`
   - [ ] Logos are committed and referenced with relative paths that exist
   - [ ] `README.md` and a license file are present
   - [ ] No `starter-simple` / `starter-advanced` / `Your Org` placeholders
   - [ ] No invented emails or secrets
3. Confirm the root `README.md` lists every plugin in `marketplace.json` (multi-plugin repos).
4. **Publish path:**
   - Public: [cursor.com/marketplace/publish](https://cursor.com/marketplace/publish) — submit the GitHub repo after it is public
   - Team: Dashboard → Plugins → Import the GitHub repo
5. After submit, keep a short note of what was checked (pass/fail). Fix errors before asking the user to click publish.

## Rules

- Prefer the local validator when `scripts/validate-template.mjs` exists; otherwise do not invent a new one — walk the checklist.
- Do not block on hooks/MCP files; they are optional (this plugin has none).
- Do not rewrite existing plugins while validating.
