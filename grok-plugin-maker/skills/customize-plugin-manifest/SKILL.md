---
name: customize-plugin-manifest
description: >-
  Edit plugin.json and marketplace.json for a Cursor plugin. Use when the
  user is filling required fields, setting a logo path, or fixing marketplace
  source / author / keyword mistakes.
---

# Customize plugin manifest

Edit the per-plugin manifest and, when needed, the marketplace registry.

## When to use

- Filling or reviewing `.cursor-plugin/plugin.json`
- Registering or updating an entry in `.cursor-plugin/marketplace.json`
- Logo path, keywords, version, or author mismatches

## Steps

1. Open `<plugin>/.cursor-plugin/plugin.json`.
2. Set required / expected fields (this repo’s style):

   | Field | Notes |
   |---|---|
   | `name` | Unique lowercase kebab-case; must match the marketplace entry and folder |
   | `version` | Semver (`1.0.0`) |
   | `description` | What the plugin does |
   | `author` | `{ "name": "Lloyd Sity" }` — no invented email |
   | `license` | `MIT` |
   | `keywords` | Discovery tags |
   | `logo` | Relative path from the **plugin folder**, e.g. `assets/logo.svg` |

3. Add `hooks`, `skills`, `rules`, etc. in the manifest **only** when overriding default folder discovery. Default discovery: `rules/`, `skills/*/SKILL.md`, `agents/`, `commands/`, `hooks/hooks.json`, `mcp.json`.
4. If the repo has `.cursor-plugin/marketplace.json` (this one does):
   - `name` matches `plugin.json`
   - `source` is relative to the **repo root**: here `"source": "<folder-name>"` (not `./plugins/<folder-name>`)
   - Keep `author.name` as **Lloyd Sity**
   - Bump `metadata.version` when adding a plugin; extend `metadata.description` so every listed plugin is named
5. Confirm the logo file exists at the referenced path. Relative `logo` values resolve from the plugin directory (committed file preferred over a remote URL).

## Rules

- Do not use `displayName` in this marketplace unless siblings already use it (they do not).
- Paths must be relative — no `..`, no absolute paths.
- Official template `source` examples with `./plugins/…` are **wrong for this repo**.
- Common pitfalls: name ≠ folder ≠ marketplace `name`; missing logo file; leftover `Your Org` / starter names; `source` pointing at a missing directory.
