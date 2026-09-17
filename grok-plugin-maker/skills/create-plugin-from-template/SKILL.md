---
name: create-plugin-from-template
description: >-
  Start a new Cursor marketplace plugin from the official template or by
  adding a folder to a multi-plugin marketplace repo. Use when the user
  wants to scaffold a plugin, clone the template, or add a sibling plugin
  folder (e.g. next to clarity-gate / build-origin in this marketplace repo).
---

# Create plugin from template

Help the user start a Cursor marketplace plugin for **their** publisher name/org. Match the repo they are in over the upstream template when those layouts conflict.

## When to use

- “Create a Cursor plugin” / “scaffold from the template”
- Adding a new plugin to a multi-plugin marketplace
- Choosing single-plugin vs multi-plugin layout

## Steps

1. Confirm the plugin **name**: unique, lowercase kebab-case, starts and ends alphanumeric. For **author**, use the publisher’s real name or org. If unknown, ask the user. Never invent an email or a name.
2. Choose layout:
   - **Root-level multi-plugin marketplace** (e.g. this marketplace repo: sibling folders like `clarity-gate/`, `build-origin/`, `grok-plugin-maker/`): new folder at the **repository root** (`<name>/`), register `"source": "<name>"` in `.cursor-plugin/marketplace.json`. Do **not** introduce a `plugins/` directory into a repo that already uses root-level siblings.
   - **Official template multi-plugin:** [cursor/plugin-template](https://github.com/cursor/plugin-template) uses `plugins/<name>/` and `"source": "./plugins/<name>"`. Use that when starting from that template or when the target repo already uses `plugins/`.
   - **Single-plugin repo:** plugin contents at the repo root, one `.cursor-plugin/plugin.json`, **no** `marketplace.json`.
3. Scaffold the folder (copy from the template’s **starter-simple** for skills+rules, or **starter-advanced** only if hooks/MCP/agents/commands are required). Then **replace every placeholder** (`Your Org`, `plugins@example.com`, `starter-simple`, `starter-advanced`, sample logos/copy) with the user’s publisher and plugin identity.
4. Minimum files:
   - `.cursor-plugin/plugin.json` — `name`, `version`, `description`, `author.name` (publisher’s real name/org), `license`, `keywords`, `logo`
   - `assets/logo.svg` (or another committed image) referenced by a relative `logo` path
   - `README.md`, `LICENSE` (MIT unless the user specifies otherwise), `CHANGELOG.md`
   - Only the components you need (`rules/`, `skills/<skill>/SKILL.md`, …)
5. If this is a multi-plugin marketplace, append a `plugins[]` entry (`name`, `source`, `description`, `author`, `version`, `keywords`) and mention the new plugin in the root `README.md`. Keep `author.name` consistent with `plugin.json`.
6. Add only needed components. Skip hooks, MCP, agents, and commands unless there is a concrete reason.

## Rules

- Match **the target repo’s conventions** over the template when they disagree. In this marketplace repo that means root-level plugin folders and no `displayName` unless siblings already have it.
- Do not invent emails, names, or secrets. Do not leave starter placeholders.
- Do not rewrite or relocate existing plugins unless the user asks (in this marketplace repo: leave `clarity-gate` and `build-origin` alone).
