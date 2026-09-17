# Plugin Maker

<img src="assets/logo.png" alt="Plugin Maker hexagonal network emblem" width="96" height="96">

Created by **Lloyd Sity**. Marketplace mark: hexagonal network emblem on indigo `#1A1033`.

**Create any Cursor marketplace plugin — choose simple or advanced, then scaffold from the official template.**

This is a **plugin factory**. After install, ask the agent for whatever you want to ship (Notion sync, a rules-only style guide, an MCP connector, a deploy workflow, …). It will walk purpose → name → publisher → Simple vs Advanced → repo layout, then write the files, register the marketplace entry when needed, and prepare submit.

Author guidance is generic: use **your** name or org (the agent should ask if unknown and never invent emails). This plugin’s own manifests stay **Lloyd Sity**.

Based on the official [Cursor plugin template](https://github.com/cursor/plugin-template) (`starter-simple` / `starter-advanced`). This marketplace repo is one example of a **root-level multi-plugin** layout (sibling folders, no `plugins/` subdirectory). Official template repos use `plugins/<name>/`.

## When to use

- “I want a … plugin” for any topic
- Choosing **Simple** (rules + skills) vs **Advanced** (agents, commands, hooks, MCP, scripts)
- Adding a plugin folder to a multi-plugin marketplace (e.g. next to `clarity-gate/` in this repo)
- Filling manifests, logos, and component frontmatter
- Checking a plugin before [Marketplace publish](https://cursor.com/marketplace/publish) or team import

## What it ships

| Kind | Path | Role |
|---|---|---|
| Rule | `rules/plugin-authoring.mdc` | Factory order, Simple vs Advanced, names, manifests, `source`, validate-then-submit |
| Skill | `skills/choose-plugin-starter` | Pick Simple vs Advanced and explain tradeoffs |
| Skill | `skills/create-plugin-from-template` | Interview, then scaffold the real plugin from the official template |
| Skill | `skills/customize-plugin-manifest` | Edit `plugin.json` and `marketplace.json`; logos, hooks/MCP paths |
| Skill | `skills/validate-and-submit-plugin` | Pre-submit checklist and publish path |

Plugin Maker itself is **Simple** (skills + rules only). The plugins it *creates* can be Simple or Advanced.

## Install (local)

```bash
mkdir -p ~/.cursor/plugins/local
ln -sfn "$(pwd)/plugin-maker" ~/.cursor/plugins/local/plugin-maker
```

Then in Cursor: **Developer: Reload Window**. Confirm under **Customize → Plugins** that `plugin-maker` is listed.

## Marketplace

This plugin is registered in the repo-root `.cursor-plugin/marketplace.json` with `"source": "plugin-maker"`.

- Public submit: [cursor.com/marketplace/publish](https://cursor.com/marketplace/publish)
- Team import: Dashboard → Plugins → Import this GitHub repo

## License

MIT · © Lloyd Sity
