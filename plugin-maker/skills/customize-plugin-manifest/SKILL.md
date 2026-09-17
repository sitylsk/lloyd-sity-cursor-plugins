---
name: customize-plugin-manifest
description: >-
  Edit plugin.json and marketplace.json for a Cursor plugin. Use when the
  user is filling required fields, setting a logo path, wiring hooks/MCP
  paths, or fixing marketplace source / author / keyword mistakes.
---

# Customize plugin manifest

Edit the per-plugin manifest and, when needed, the marketplace registry. Works for Simple and Advanced plugins.

## When to use

- Filling or reviewing `.cursor-plugin/plugin.json`
- Registering or updating an entry in `.cursor-plugin/marketplace.json`
- Logo path, keywords, version, author, hooks, or MCP mismatches

## Steps

1. Open `<plugin>/.cursor-plugin/plugin.json`.
2. Set required / expected fields (both shapes):

   | Field | Notes |
   |---|---|
   | `name` | Unique lowercase kebab-case; must match the marketplace entry and folder |
   | `version` | Semver (`1.0.0`) |
   | `description` | What the plugin does |
   | `author` | `{ "name": "<publisher name or org>" }` — use the real publisher; ask if unknown; never invent an email |
   | `license` | Usually `MIT` unless the user specifies otherwise |
   | `keywords` | Discovery tags |
   | `logo` | Relative path from the **plugin folder**, e.g. `assets/logo.svg` |

3. **Simple plugins:** do not add `hooks`, `mcpServers`, or `variables`. Folder discovery already finds `rules/` and `skills/`.
4. **Advanced plugins (only if those files exist):**
   - Leave `hooks` / `mcpServers` unset when using defaults (`hooks/hooks.json`, `mcp.json`).
   - Set them only to point at a custom relative path or inline config.
   - Every `${VAR}` in `mcp.json` must be declared under `variables` in `plugin.json`. Values are set in the dashboard (Plugins → Configure), never committed.
   - Confirm hook `command` paths exist under the plugin (usually `./scripts/…`).
5. If the repo has `.cursor-plugin/marketplace.json`:
   - `name` matches `plugin.json`
   - `source` is relative to the **repo root**. In a root-level multi-plugin marketplace (e.g. this repo) that is `"source": "<folder-name>"`, not `./plugins/<folder-name>`. Official template repos use `"source": "./plugins/<folder-name>"`.
   - `author.name` is present and **the same** on the marketplace entry and in `plugin.json`
   - Bump `metadata.version` when adding a plugin; extend `metadata.description` so every listed plugin is named
6. Confirm the logo file exists at the referenced path. Relative `logo` values resolve from the plugin directory (committed file preferred over a remote URL).

## Rules

- `displayName`: include it only if the target repo already uses it. In this marketplace repo, siblings do not, so omit it here.
- Paths must be relative — no `..`, no absolute paths.
- Official template `source` examples with `./plugins/…` are wrong **for root-level marketplaces** (e.g. this repo). They are correct for template-style `plugins/` repos.
- Missing `hooks/hooks.json` or `mcp.json` is fine for Simple. It is a problem for Advanced only when the purpose claimed those components but the files are absent or still say `postgres` / sample scripts.
- Common pitfalls: name ≠ folder ≠ marketplace `name`; missing logo file; leftover `Your Org` / starter names; `source` pointing at a missing directory; author missing or inconsistent; secrets in `mcp.json`.
