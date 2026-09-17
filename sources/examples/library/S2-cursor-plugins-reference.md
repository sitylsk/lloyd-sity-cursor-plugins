---
id: S2
title: Plugins reference
url: https://cursor.com/docs/reference/plugins
retrieved: 2026-09-17
publisher: Cursor
tags: [cursor, plugins, manifest, marketplace]
---

Fetched 2026-09-17. Notes from the page:

"Every Cursor Plugin requires a `.cursor-plugin/plugin.json` manifest file."

Required `name`: "Plugin identifier. Lowercase, kebab-case (alphanumerics, hyphens, and periods). Must start and end with an alphanumeric character."

"Cursor Plugin manifests only require a `name`" is stated on the sibling Plugins page; this reference lists `name` as the required field and the rest as optional (`description`, `version`, `author`, `license`, `keywords`, `logo`, component path overrides, `variables`).

Folder discovery when paths are omitted: Skills `skills/` (subdirectory with `SKILL.md`); Rules `rules/` (`.md`, `.mdc`, or `.markdown`); Commands `commands/` (`.md`, `.mdc`, `.markdown`, or `.txt`); Hooks `hooks/hooks.json`; MCP `mcp.json`.

Rules require YAML frontmatter. Documented fields include `description`, `alwaysApply`, and `globs`.

Skills require YAML frontmatter with `name` and `description`.

Commands "can include YAML frontmatter" with `name` and `description`.

"A single Git repository can contain multiple plugins using a marketplace manifest. Place it at `.cursor-plugin/marketplace.json` in the repository root."

Marketplace `plugins[].source` example uses folder names such as `"source": "plugin-one"`. Resolution: "The parser looks for `my-plugin/.cursor-plugin/plugin.json`".

Logos: "Commit logos to your repository and reference them using a relative path". Example: `"logo": "assets/logo.svg"`.

Submit: "Go to cursor.com/marketplace/publish and submit your repository link."

Submission checklist includes: valid manifest; unique lowercase kebab-case `name`; components have valid files and frontmatter; logo referenced by relative path if provided; `README.md` documents usage; relative paths only; tested locally; multi-plugin repos have `.cursor-plugin/marketplace.json` at the repo root.
