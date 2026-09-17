---
name: draft-from-library
description: >-
  Draft a post, doc, or brief using only the project .sources/ library and
  citing every factual claim. Use when the user wants a write-up from saved
  research, a sourced brief, or “write this from the library.”
---

# Draft from library

Write from what is already saved. The library is `.sources/` in the user's project.

## When to use

- User wants a post, doc, or brief grounded in saved research
- User says “write from the library”, “draft a brief”, or “turn these notes into a post”
- Follow-up after several `save-research` captures

## Steps

1. **Lock the assignment** if it is not already clear (ask only what is missing):
   - Form: post, doc, or brief
   - Audience and length
   - Topic / angle
   - Output path (default `.sources/drafts/<slug>.md`)
2. **Inventory the library.** Read `.sources/index.md` and the relevant notes. List which note ids you will use and which requested facts are **not** in the library.
3. **Stop if the library cannot support the piece.** If there are no notes, or the notes do not cover the assigned topic, do not draft a factual piece. Tell the user what to save with `save-research`. A one-paragraph outline of *questions* is OK; a sourced article is not.
4. **Draft using only library facts.** Every factual sentence gets ` [S:<note-id>]` pointing at a note that actually contains that fact.
5. **End with a Sources list** (title, locator, path) for every id you cited.
6. **Write the file** to `.sources/drafts/` unless the user named another path. Create `drafts/` if needed. Then summarize: form, claim count, notes used, and any gaps you omitted on purpose.

## What you may write without a citation

- Structure (headings, transitions)
- Questions you are asking the reader
- Clearly labeled opinion or recommendation (“I recommend…”) that does not smuggle in a number or attributed fact

## What you may not do

- Invent sources, quotes, statistics, or “common knowledge” fillers to make the piece feel complete
- Cite a note that does not contain the claim
- Use the live web to pad the library unless the user asked you to save that material first (`save-research`)
- Leave factual claims uncited — if it cannot be cited, cut it or mark `[UNCITED]` and call that out

## Suggested shapes

**Brief** — 8–20 lines: context, 3–7 sourced findings, implications, Sources list.

**Doc** — sections that map to clusters of notes; each section stays inside those notes.

**Post** — a tight narrative. Prefer fewer, stronger claims over a wide unsourced sweep.

## After drafting

Offer a `cite-claims` pass if the user edited the draft by hand. If they want a stronger piece, tell them which missing claims to capture next — do not fetch those claims yourself unless they ask to save them.
