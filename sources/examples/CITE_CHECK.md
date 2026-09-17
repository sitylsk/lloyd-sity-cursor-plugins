# Cite check

**Verdict:** pass
**Draft:** `.cursor/sources/drafts/what-belongs-in-a-cursor-plugin.md` (copy: `examples/drafts/what-belongs-in-a-cursor-plugin.md`)

| # | Claim (short) | Citation | Result |
|---|---|---|---|
| 1 | Plugins can package rules, skills, agents, commands, MCP, hooks | S1 | pass |
| 2 | Cursor Plugins use `.cursor-plugin/plugin.json` | S1, S2 | pass |
| 3 | Manifest only requires `name`; other fields optional | S1, S2 | pass |
| 4 | `name` is lowercase kebab-case (alphanumerics, hyphens, periods) | S2 | pass |
| 5 | Default discovery: `skills/`, `rules/`, `commands/` | S2 | pass |
| 6 | Rules are `.mdc` with YAML `description` / `alwaysApply` / `globs` | S1, S2 | pass |
| 7 | Skills need frontmatter `name` + `description` | S2 | pass |
| 8 | Commands may include those two frontmatter fields | S2 | pass |
| 9 | Template starters: simple (rules+skills) vs advanced (+agents, commands, hooks, MCP, scripts) | S3 | pass |
| 10 | Official template defaults to multi-plugin | S3 | pass |
| 11 | Single-plugin layout: files at repo root, drop marketplace.json | S3 | pass |
| 12 | Multi-plugin list lives at `.cursor-plugin/marketplace.json` | S1, S2 | pass |
| 13 | `source` is a folder; parser opens `<folder>/.cursor-plugin/plugin.json` | S2 | pass |
| 14 | Marketplace entries must map to real folders; names unique | S3 | pass |
| 15 | Logo committed and referenced with a relative path | S2, S3 | pass |
| 16 | README should document usage | S2 | pass |
| 17 | Local test: `~/.cursor/plugins/local` + Reload Window + Customize | S1 | pass |
| 18 | Marketplace listing is a Git-repo submit; plugins are manually reviewed | S1 | pass |
| 19 | Public submit URL is cursor.com/marketplace/publish | S1, S2 | pass |

Framing (title, intro sentence, headings, Sources list) left unmarked.

All cited ids exist in `INDEX.md`. Quotes and folder names used in the draft appear in the matching library files.
