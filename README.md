# Lloyd Sity — Cursor Plugins

Plugins by **Lloyd Sity**.

| Plugin | What it does |
|---|---|
| [clarity-gate](./clarity-gate) | Blocks vague Agent prompts; Resolve Board before spend |
| [build-origin](./build-origin) | Tracks desktop vs mobile vs cloud/web build mix; GitHub report |
| [grok-plugin-maker](./grok-plugin-maker) | Scaffold, customize, and validate Cursor marketplace plugins |

## Install both (local)

```powershell
powershell -ExecutionPolicy Bypass -File .\clarity-gate\scripts\install-local.ps1
powershell -ExecutionPolicy Bypass -File .\build-origin\scripts\install-local.ps1
```

Then **Developer: Reload Window**.

Grok Plugin Maker is skills + rules only (no install script). From the repo root:

```bash
mkdir -p ~/.cursor/plugins/local
ln -sfn "$(pwd)/grok-plugin-maker" ~/.cursor/plugins/local/grok-plugin-maker
```

Then **Developer: Reload Window**.

## Marketplace

This repo is a multi-plugin marketplace (`/.cursor-plugin/marketplace.json`).

- Public submit: [cursor.com/marketplace/publish](https://cursor.com/marketplace/publish)
- Team import: Dashboard → Plugins → Import this GitHub repo

## Creator

**Lloyd Sity**
