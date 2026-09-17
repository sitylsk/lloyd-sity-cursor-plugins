# Grok Plugin Maker

Created by **Lloyd Sity**.

**Help create Cursor marketplace plugins from the official template.**

Grok Plugin Maker is a skills + rules plugin. Use it when you are scaffolding a new Cursor plugin, editing `plugin.json` / `marketplace.json`, or preparing a Marketplace submission.

It is based on the official [Cursor plugin template](https://github.com/cursor/plugin-template). Skills and the authoring rule work for **any publisher** — use the user’s real name/org (ask if unknown; never invent emails). This marketplace repo is one example of a **root-level multi-plugin** layout (sibling folders, no `plugins/` subdirectory). Official template repos instead use `plugins/<name>/`.

## When to use

- Starting a new plugin from the official template
- Adding a plugin folder to a multi-plugin marketplace (e.g. next to `clarity-gate/` and `build-origin/` in this repo)
- Filling manifests, logos, and component frontmatter
- Checking a plugin before [Marketplace publish](https://cursor.com/marketplace/publish) or team import

## What it ships

| Kind | Path | Role |
|---|---|---|
| Rule | `rules/plugin-authoring.mdc` | Names, required fields, frontmatter, marketplace `source`, layouts, validate-then-submit |
| Skill | `skills/create-plugin-from-template` | Scaffold from the template or into a multi-plugin marketplace repo |
| Skill | `skills/customize-plugin-manifest` | Edit `plugin.json` and `marketplace.json`; logos and common pitfalls |
| Skill | `skills/validate-and-submit-plugin` | Pre-submit checklist and publish path |

No hooks or MCP. Skills and the authoring rule are enough for this job.

## Install (local)

```bash
mkdir -p ~/.cursor/plugins/local
ln -sfn "$(pwd)/grok-plugin-maker" ~/.cursor/plugins/local/grok-plugin-maker
```

Then in Cursor: **Developer: Reload Window**. Confirm under **Customize → Plugins** that `grok-plugin-maker` is listed.

## Marketplace

This plugin is registered in the repo-root `.cursor-plugin/marketplace.json` with `"source": "grok-plugin-maker"`.

- Public submit: [cursor.com/marketplace/publish](https://cursor.com/marketplace/publish)
- Team import: Dashboard → Plugins → Import this GitHub repo

## License

MIT · © Lloyd Sity
