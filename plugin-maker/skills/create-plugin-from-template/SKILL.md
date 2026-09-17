---
name: create-plugin-from-template
description: >-
  Plugin factory: interview the user, then scaffold any Cursor marketplace
  plugin (any topic) as Simple or Advanced from the official template.
  Use when they want a new plugin — Notion sync, style rules, MCP connector,
  workflow, or anything else — or to add a folder to a marketplace repo.
---

# Create plugin from template

This is a **plugin factory**. Produce a real plugin for **the user’s idea**, not a second “plugin maker.” Any publisher, any topic.

Copy structure from [cursor/plugin-template](https://github.com/cursor/plugin-template) (`plugins/starter-simple` or `plugins/starter-advanced`), then **replace every placeholder** with their product.

If Simple vs Advanced is undecided, run `choose-plugin-starter` first (or ask that one question here).

## When to use

- “I want a Notion sync plugin” / “rules-only coding style plugin” / any new marketplace plugin
- Scaffold from the official template
- Add a plugin to an existing marketplace repo

## Interview (one unanswered item at a time)

Skip any item the user already gave. Do **not** scaffold until 1–5 are known (or they explicitly say “just pick and build”).

1. **Purpose** — What should the plugin do? Who is it for? One sentence is enough. Accept any domain.
2. **Name** — Unique lowercase kebab-case; start and end alphanumeric. Suggest 1–2 names from the purpose if they have none.
3. **Publisher** — Real name or org for `author.name`. Ask if unknown. Never invent a name or email.
4. **Starter** — **Simple** (rules + skills) vs **Advanced** (also agents, commands, hooks, MCP, scripts). See `choose-plugin-starter`. Recommend from purpose, then confirm.
5. **Layout / repo**
   - Already in a **root-level multi-plugin** marketplace (e.g. this repo: sibling folders like `clarity-gate/`): add `<name>/` at the repo root, `"source": "<name>"`. Do not invent a `plugins/` directory.
   - Already in / generating from the **official template**: `plugins/<name>/`, `"source": "./plugins/<name>"`.
   - **New single-plugin repo:** files at repo root, one `.cursor-plugin/plugin.json`, no `marketplace.json`.
   - **New from template:** clone or generate https://github.com/cursor/plugin-template, then replace `starter-simple` / `starter-advanced` with the new plugin (do not leave those names).

Restate the locked plan in 4–6 lines, then write files.

## Scaffold

Create files on disk. Tailor rule/skill/agent/command **content to the purpose**. Do not copy template “code-reviewer / coding-standards / postgres” samples unless that *is* the product.

### Always (both shapes)

```text
<plugin-root>/
  .cursor-plugin/plugin.json
  assets/logo.svg
  README.md
  LICENSE
  CHANGELOG.md
  rules/<topic>.mdc          # YAML description (+ alwaysApply / globs)
  skills/<skill-name>/SKILL.md   # YAML name + description
```

`plugin.json`: `name`, `version` (`0.1.0` or `1.0.0`), `description`, `author.name` (publisher), `license`, `keywords`, `logo`. Add `displayName` only if siblings in that repo already use it (this marketplace repo does not).

### Simple (`starter-simple`)

Stop after rules + skills. **Do not** add `agents/`, `commands/`, `hooks/`, `mcp.json`, or `scripts/`.

Examples that stay Simple: repo style guide, writing voice, QA checklist, “how we name PRs.”

### Advanced (`starter-advanced`)

Offer the full skeleton. Create a component only when the purpose needs it; say what you skipped.

| Component | Create when | Frontmatter / notes |
|---|---|---|
| `agents/*.md` | Custom persona / reviewer | `name`, `description` |
| `commands/*.(md\|txt)` | Slash commands | `name`, `description` |
| `hooks/hooks.json` + `scripts/` | Automation on edit, prompt, shell, session | Relative script paths; no secrets |
| `mcp.json` | External tool/API | No API keys in repo. Use `${VAR}` and declare `variables` in `plugin.json` |

Declare `hooks` / `mcpServers` in `plugin.json` only to override default discovery (`hooks/hooks.json`, `mcp.json`).

Examples that usually go Advanced: Notion/Slack/GitHub connectors (MCP), format-on-edit (hooks), `/deploy` commands, a security-reviewer agent.

### After files exist

6. Replace leftover `Your Org`, `plugins@example.com`, `starter-simple`, `starter-advanced`, sample logos, and sample skill/rule names.
7. Multi-plugin: append `plugins[]` (`name`, `source`, `description`, `author`, `version`, `keywords`). Keep `author.name` identical to `plugin.json`. Mention the plugin in the root README. Bump marketplace `metadata.version` when adding an entry.
8. Hand off to `customize-plugin-manifest` if fields still look wrong, then `validate-and-submit-plugin`.

## Rules

- Factory for **their** plugin. Do not steer every idea into “plugin maker” or this repo’s other products.
- Match the **target repo’s** layout. In this marketplace repo: root-level folders; leave `clarity-gate` and `build-origin` alone unless asked.
- Never invent emails, secrets, or publisher names.
- No starter placeholders in the finished tree.
- README must explain *their* plugin, when to use it, and what it ships.
