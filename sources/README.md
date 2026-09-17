# Sources

Created by **Lloyd Sity**.

**Save research, force a citation per claim, and draft posts, docs, or briefs from that library.**

Sources is a **research writing** plugin. Capture URLs, papers, and notes into a workspace library, then write only what those entries can support. Unsourced claims stay marked or do not ship.

This plugin is **Advanced** for slash commands (`/save-source`, `/cite-check`, `/draft-from-sources`). It skips hooks, MCP, agents, and scripts — the library is markdown in the project, not an external API.

## When to use

- Saving a link, paper, or excerpt before you write
- Drafting a post, doc, or brief that must stay cited
- Checking a draft so every factual claim points at the library
- Refusing invented quotes, URLs, or “close enough” citations

## Library (this workspace)

Runtime files live in the **project** you are writing in, not inside this plugin folder:

```text
.cursor/sources/INDEX.md
.cursor/sources/library/S1-short-slug.md
.cursor/sources/library/S2-another-source.md
```

Each library file has YAML `id`, `title`, `retrieved`, and at least one of `url` / `path` / `authors`. Drafts cite by id: `…the claim.[S1]`

A committed format sample lives in [`examples/`](./examples/).

## Usage

| Action | How |
|---|---|
| Save research | `/save-source` (or ask to save a URL / excerpt) |
| Draft from the library | `/draft-from-sources` |
| Check citations | `/cite-check` |

The always-on rule applies when you are writing posts, docs, briefs, or other factual prose. Code and refactors are out of scope unless you asked for a sourced document.

## What it ships

| Kind | Path | Role |
|---|---|---|
| Rule | `rules/cite-every-claim.mdc` | No unsourced factual claims in prose |
| Skill | `skills/save-source` | Interview, assign `S#`, write library + index |
| Skill | `skills/cite-check` | Claim-by-claim pass/fail against the library |
| Skill | `skills/draft-from-sources` | Post / doc / brief using only saved sources |
| Command | `commands/save-source.md` | `/save-source` |
| Command | `commands/cite-check.md` | `/cite-check` |
| Command | `commands/draft-from-sources.md` | `/draft-from-sources` |

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
