---
name: save-source
description: >-
  Save a URL, paper, file, or excerpt into the workspace Sources library.
  Use when the user says /save-source, pastes research to keep, or needs a
  citable id before drafting.
---

# /save-source — capture research

Add one source to `.cursor/sources/` so later drafts can cite it.

## Steps

1. Read `.cursor/sources/INDEX.md` if it exists. Next id is `S{n+1}` (start at `S1`).
2. Collect only what the user provided or what you can **read** from a given URL/path:
   - **title** (required)
   - **url** and/or local **path** (at least one)
   - **authors**, **published**, **publisher** when visible
   - **retrieved** (today’s date)
   - **tags** (short, optional)
   - **excerpt** / notes — quote only text you actually saw
3. If a required field is missing, ask. Do not guess a title, URL, or quote.
4. Slug: lowercase kebab-case from the title, max ~40 chars.
5. Write `.cursor/sources/library/<id>-<slug>.md`:

```markdown
---
id: S1
title: Visible title
url: https://example.com/page
path:
authors: Name if stated
published: 2026-01-15
retrieved: 2026-09-17
publisher: Site or press if stated
tags: [research]
---

Quoted excerpt or notes. Use quotation marks for verbatim text.
```

Omit empty optional keys rather than inventing values.

6. Create or update `.cursor/sources/INDEX.md`:

```markdown
# Sources index

| ID | Title | Locator | Tags |
|---|---|---|---|
| S1 | Visible title | https://example.com/page | research |
```

`Locator` is the url, else the path.

7. Reply with the new id, file path, and one line on what it can support. Do not start a draft unless the user asked.

## Rules

- One source per invocation unless the user pastes a clear list.
- Fetch a URL only when the user gave it; summarize from the fetched page, not from memory.
- Duplicate URL/path: point at the existing id instead of creating a second card.
- Never invent emails, paywalled text, or page titles you did not see.
