---
name: choose-plugin-starter
description: >-
  Help the user pick Simple vs Advanced for a new Cursor marketplace plugin.
  Use when they are unsure which starter to use, ask about hooks/MCP, or say
  things like “rules-only”, “Notion sync”, or “full plugin with commands”.
---

# Choose plugin starter

Pick a starter **shape** for any plugin idea. Map to the official [plugin template](https://github.com/cursor/plugin-template): **starter-simple** vs **starter-advanced**.

This is only the shape. The topic can be anything (style rules, Notion sync, deploy workflow, MCP connector, review agent, …).

## When to use

- User has not chosen Simple vs Advanced
- User asks what hooks, MCP, agents, or commands are for
- Before scaffolding in `create-plugin-from-template`

## Tradeoffs

| | **Simple** (`starter-simple`) | **Advanced** (`starter-advanced`) |
|---|---|---|
| Includes | `rules/` + `skills/` only | Rules + skills **plus** `agents/`, `commands/`, `hooks/hooks.json`, `mcp.json`, `scripts/` |
| Needs | Nothing extra (works on plans that load skills/rules) | Hooks need Cursor Pro+; MCP needs a real server or command |
| Best for | Guidance, checklists, coding style, “how we work” | External APIs, automation on edit/submit, slash commands, custom agents |
| Cost of later growth | Add folders when needed | Easy to over-scaffold unused stubs |

## How to choose

Recommend **Simple** when the plugin mainly tells the agent how to behave:

- Coding style / lint-in-prose rules
- PR or commit checklists
- Domain playbooks (writing, QA, product)
- A few skills with no live data source

Recommend **Advanced** when the purpose needs at least one of:

- **MCP** — talk to Notion, Slack, GitHub, a DB, or any API
- **Hooks** — run scripts on prompt, edit, shell, or session events
- **Commands** — user-facing `/slash` actions
- **Agents** — a specialized reviewer or worker persona
- **Scripts** — hook helpers or local CLIs

If still unsure: default **Simple**, say they can add advanced folders later. Do **not** create empty `hooks/` or `mcp.json` “just in case” unless they picked Advanced.

## Ask (if not already answered)

One question:

> **Simple** (rules + skills only) or **Advanced** (also agents, commands, hooks, MCP, scripts)?

Give a one-line recommendation from their purpose, then wait. After they pick, continue with `create-plugin-from-template`.

## Rules

- Do not invent MCP servers, API keys, or emails.
- Advanced means *offer* the full skeleton; still skip a component if the purpose clearly does not need it (say so).
- Hooks are not available on Hobby/free Cursor — mention that when recommending Advanced for automation.
