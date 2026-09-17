---
name: create-plugin-from-template
description: >-
  Start a new Cursor marketplace plugin from the official template or by
  adding a folder to a Lloyd Sity-style multi-plugin repo. Use when the user
  wants to scaffold a plugin, clone the template, or add a sibling of
  clarity-gate / build-origin.
---

# Create plugin from template

Help the user start a Cursor marketplace plugin. Prefer this repo’s layout over the upstream `plugins/` folder when they conflict.

## When to use

- “Create a Cursor plugin” / “scaffold from the template”
- Adding a new plugin next to `clarity-gate/` or `build-origin/`
- Choosing single-plugin vs multi-plugin layout

## Steps

1. Confirm the **name**: unique, lowercase kebab-case, starts and ends alphanumeric. Author everywhere: **Lloyd Sity**.
2. Choose layout:
   - **Lloyd Sity multi-plugin (this repo):** new folder at the **repository root** (`<name>/`), register `"source": "<name>"` in `.cursor-plugin/marketplace.json`. Do **not** create `plugins/`.
   - **Official template multi-plugin:** [cursor/plugin-template](https://github.com/cursor/plugin-template) uses `plugins/<name>/` and `"source": "./plugins/<name>"`. Use that only when starting from that template, not when adding to this repo.
   - **Single-plugin repo:** plugin contents at the repo root, one `.cursor-plugin/plugin.json`, **no** `marketplace.json`.
3. Scaffold the folder (copy from the template’s **starter-simple** for skills+rules, or **starter-advanced** only if hooks/MCP/agents/commands are required). Then **replace every placeholder** (`Your Org`, `plugins@example.com`, `starter-simple`, `starter-advanced`, sample logos/copy).
4. Minimum files:
   - `.cursor-plugin/plugin.json` — `name`, `version`, `description`, `author.name`, `license`, `keywords`, `logo`
   - `assets/logo.svg` (or another committed image) referenced by a relative `logo` path
   - `README.md`, `LICENSE` (MIT), `CHANGELOG.md`
   - Only the components you need (`rules/`, `skills/<skill>/SKILL.md`, …)
5. If this is a multi-plugin marketplace, append a `plugins[]` entry (`name`, `source`, `description`, `author`, `version`, `keywords` as this repo does) and mention the new plugin in the root `README.md`.
6. Add only needed components. Skip hooks, MCP, agents, and commands unless there is a concrete reason.

## Rules

- Match **this repo’s conventions** over the template when they disagree (root-level plugin folders; no `displayName` unless siblings already have it).
- Do not invent emails or secrets. Do not leave starter placeholders.
- Do not rewrite or relocate existing plugins (`clarity-gate`, `build-origin`).
