---
name: draft-from-sources
description: >-
  Draft a post, doc, or brief using only the workspace Sources library.
  Use when the user says /draft-from-sources or asks to write from saved
  research with a citation on every claim.
---

# /draft-from-sources — write from the library

Produce a finished-looking post, doc, or brief whose facts are all in `.cursor/sources/`.

## Steps

1. If `.cursor/sources/INDEX.md` is missing or empty, run `save-source` first. Do not draft from memory.
2. Lock the brief (ask only what is still unknown):
   - **form** — post, doc, or brief
   - **topic** and audience
   - **which ids** — named list, or all library entries
3. Read those library files. List the claims they can honestly support. Drop anything they cannot.
4. Outline, then write. Every factual sentence ends with `[S#]` (comma-separate if two sources jointly support it).
5. Close with:

```markdown
## Sources

- **[S1]** Title — locator
- **[S2]** Title — locator
```

List only ids you cited.

6. Save to `.cursor/sources/drafts/<slug>.md` unless the user named another path.
7. Run the `cite-check` procedure on that file. If it fails, fix or delete the unsupported sentence. Do not ship a fail.

## Rules

- No source, no claim. Prefer a shorter piece over an unsourced paragraph.
- Do not upgrade “the page mentions X” into “X is proven.”
- Verbatim quotes must exist in the library file.
- If the user demands a point the library cannot support, say so and offer `save-source`.
- Title and byline may be unsourced; treat them as framing.
