---
name: save-research
description: >-
  Capture research into the project .sources/ library (index + one note per
  source). Use when the user pastes an article, URL, excerpt, or says save
  this research / add a source.
---

# Save research

Capture one source at a time into the **project** library. Do not invent metadata.

## Library convention

All notes live in the user's project (not inside this plugin):

```text
.sources/
  index.md                 # catalog of every note
  notes/<note-id>.md       # one file per source
  drafts/                  # optional output from draft-from-library
```

`<note-id>` is `YYYY-MM-DD-<slug>` (UTC date of capture, kebab-case slug from the title). Must be unique. If the date folder already has that slug, append `-2`, `-3`, …

Create `.sources/notes/` on first save. Create `.sources/index.md` if missing.

## When to use

- User pastes a URL, paper, transcript, or notes and wants them kept
- User says “save this”, “add to the library”, or “remember this source”
- `draft-from-library` or `cite-claims` found a gap and the user supplied material

## Steps

1. **Identify the source.** From the user message, collect only what they actually gave:
   - Title
   - URL or other locator (DOI, book, file path)
   - Author / publisher — only if stated; otherwise leave `unknown`
   - Accessed / published date — only if stated
   - Tags (ask for 1–5 if none are obvious)
2. **Extract claims, not a dump.** Pull 3–12 factual claims or short excerpts the user cares about. Quote when the wording matters; paraphrase otherwise. Each claim should be checkable later.
3. **Write the note** at `.sources/notes/<note-id>.md` using the template below.
4. **Update** `.sources/index.md`: add one row (ID, title, locator, tags, relative path). Keep newest first. If the index does not exist yet, create it with a heading `# Sources library` and a markdown table.
5. **Confirm** to the user: note id, file path, claim count, and any fields left `unknown`.

## Note template

```markdown
---
id: YYYY-MM-DD-slug
title: Exact title or a short label the user approved
locator: https://example.invalid/path-or-doi-or-file
author: Name or unknown
published: YYYY-MM-DD or unknown
captured: YYYY-MM-DD
tags: [tag-one, tag-two]
---

# <title>

## Source

- Locator: <url, DOI, or path>
- Author: <or unknown>
- Published: <or unknown>
- Captured: <ISO date>

## Claims

1. <claim or excerpt>
2. <claim or excerpt>

## Notes

<user commentary only — do not add background you were not given>
```

The `example.invalid` host above is a placeholder in this template only. Real notes must use the locator the user provided, or `unknown`.

## Rules

- One source per note. Multiple URLs → multiple notes (say so, then save each).
- Never fabricate a URL, author, or quote to make the card look complete.
- If the user only has a title and a claim, save that. Incomplete beats invented.
- Do not overwrite an existing note id. Ask before replacing.
- Do not put secrets, credentials, or private keys into `.sources/`.
