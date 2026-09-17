# Sources

Created by **Lloyd Sity**.

**Save research, force a citation per claim, and draft posts, docs, or briefs from that library.**

Sources is a productivity plugin for citation discipline. You capture notes into a project-local library, then every factual claim in a draft has to point at that library. Unsourced claims get flagged or refused.

This plugin is **Simple** (rules + skills only). No agents, commands, hooks, or MCP.

## When to use

- Building a local research library while you read
- Reviewing a draft so every fact has a citation
- Writing a post, doc, or brief using only saved notes

## Library convention

The library lives in the **user’s project**, not inside this plugin folder:

```text
.sources/
  index.md                 # catalog
  notes/<note-id>.md       # one source per file
  drafts/                  # optional drafted output
```

`<note-id>` is `YYYY-MM-DD-<slug>`. Each note stores a locator (URL, DOI, or path), optional author, tags, and the claims you actually captured. Agents must not invent missing metadata.

## What it ships

| Kind | Path | Role |
|---|---|---|
| Rule | `rules/citation-discipline.mdc` | Always-on: factual claims need a `[S:<note-id>]` citation from `.sources/` |
| Skill | `skills/save-research` | Capture a source into `.sources/notes/` and update `index.md` |
| Skill | `skills/cite-claims` | Walk a draft, attach library citations, flag `[UNCITED]` |
| Skill | `skills/draft-from-library` | Write a post, doc, or brief using only saved notes |

Citation form in drafts: `Claim text. [S:<note-id>]`, plus a **Sources** list that resolves each id to title, locator, and `.sources/notes/<note-id>.md`.

## Install (local)

```bash
mkdir -p ~/.cursor/plugins/local
ln -sfn "$(pwd)/sources" ~/.cursor/plugins/local/sources
```

Then in Cursor: **Developer: Reload Window**. Confirm under **Customize → Plugins** that `sources` is listed.

## Marketplace

This plugin is registered in the repo-root `.cursor-plugin/marketplace.json` with `"source": "sources"`.

- Public submit: [cursor.com/marketplace/publish](https://cursor.com/marketplace/publish)
- Team import: Dashboard → Plugins → Import this GitHub repo

## License

MIT · © Lloyd Sity
